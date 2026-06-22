import argparse
import csv
import json
import re
import shutil
import unicodedata
import zipfile
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path
from xml.etree import ElementTree as ET


MAIN_NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
REL_NS = {
    "m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "pkg": "http://schemas.openxmlformats.org/package/2006/relationships",
}


def normalize(value):
    value = unicodedata.normalize("NFKD", str(value or "").casefold())
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    return re.sub(r"[^a-z0-9]+", "", value)


def normalize_exact(value):
    return " ".join(str(value or "").casefold().split())


def col_to_index(ref):
    letters = "".join(ch for ch in ref if ch.isalpha())
    index = 0
    for char in letters:
        index = index * 26 + ord(char.upper()) - 64
    return index - 1


def read_cell(cell, shared_strings):
    cell_type = cell.attrib.get("t")
    if cell_type == "inlineStr":
        return "".join(text.text or "" for text in cell.findall(".//m:t", MAIN_NS)).strip()

    value = cell.find("m:v", MAIN_NS)
    if value is None:
        return ""

    raw = (value.text or "").strip()
    if cell_type == "s" and raw.isdigit():
        index = int(raw)
        return shared_strings[index].strip() if index < len(shared_strings) else raw
    return raw


def read_xlsx_rows(path):
    with zipfile.ZipFile(path) as archive:
        shared_strings = []
        if "xl/sharedStrings.xml" in archive.namelist():
            root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
            shared_strings = [
                "".join(text.text or "" for text in item.findall(".//m:t", MAIN_NS))
                for item in root.findall("m:si", MAIN_NS)
            ]

        workbook = ET.fromstring(archive.read("xl/workbook.xml"))
        relationships = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        relationship_targets = {
            rel.attrib["Id"]: rel.attrib["Target"]
            for rel in relationships.findall("pkg:Relationship", REL_NS)
        }

        sheets = workbook.find("m:sheets", REL_NS)
        first_sheet = sheets.find("m:sheet", REL_NS)
        rel_id = first_sheet.attrib["{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"]
        target = relationship_targets[rel_id]
        sheet_path = "xl/" + target.lstrip("/")

        sheet = ET.fromstring(archive.read(sheet_path))
        rows = []
        for row in sheet.findall(".//m:sheetData/m:row", MAIN_NS):
            values = []
            for cell in row.findall("m:c", MAIN_NS):
                index = col_to_index(cell.attrib.get("r", "A"))
                while len(values) <= index:
                    values.append("")
                values[index] = read_cell(cell, shared_strings)
            rows.append(values)
        return rows


def detect_columns(rows):
    header_aliases = {
        "name": {"libelle", "libellé", "name", "product name", "designation", "description", "nom"},
        "reference": {"reference", "référence", "ref", "sku", "code", "product code", "product reference"},
        "price": {"prix vente", "prix de vente", "price", "sale price", "selling price", "prix"},
    }

    best = None
    for row_index, row in enumerate(rows[:25]):
        normalized_headers = [normalize_exact(value) for value in row]
        found = {}
        for column_index, header in enumerate(normalized_headers):
            for field, aliases in header_aliases.items():
                if header in aliases and field not in found:
                    found[field] = column_index
        if {"name", "reference", "price"}.issubset(found):
            best = (row_index, found)
            break

    if best is None:
        raise RuntimeError("Could not detect name, reference, and price columns.")
    return best


def parse_price(value):
    raw = str(value or "").strip()
    if not raw:
        return None, "empty"

    cleaned = re.sub(r"(?i)(dhs?|mad|dh|درهم|prix|price|:)", "", raw).strip()
    cleaned = cleaned.replace(" ", "")

    if "," in cleaned and "." in cleaned:
        if cleaned.rfind(",") > cleaned.rfind("."):
            cleaned = cleaned.replace(".", "").replace(",", ".")
        else:
            cleaned = cleaned.replace(",", "")
    elif "," in cleaned:
        parts = cleaned.split(",")
        cleaned = cleaned.replace(",", ".") if len(parts[-1]) in (1, 2) else cleaned.replace(",", "")

    cleaned = re.sub(r"[^0-9.\-]", "", cleaned)
    if not cleaned or cleaned in {"-", ".", "-."}:
        return None, "invalid"

    try:
        number = float(cleaned)
    except ValueError:
        return None, "invalid"

    if number < 0:
        return None, "invalid"
    return int(number) if number.is_integer() else number, None


def product_display_name(product):
    name = product.get("name") or {}
    return name.get("en") or name.get("fr") or product.get("original_title") or product.get("id", "")


def product_keys(product):
    keys = set()
    for key in (product.get("sku"), product.get("id"), product.get("product_id")):
        if key:
            keys.add(key)

    for spec in product.get("specifications") or []:
        if spec.get("value"):
            keys.add(spec["value"])

    for row in product.get("specificationRows") or []:
        for spec in row:
            if spec.get("value"):
                keys.add(spec["value"])

    table = product.get("specificationTable") or {}
    for row in table.get("rows") or []:
        for value in row:
            if value:
                keys.add(value)
    return keys


def build_indexes(products):
    sku = defaultdict(list)
    reference = defaultdict(list)
    exact_name = defaultdict(list)
    normalized_name = defaultdict(list)

    for product in products:
        for key in product_keys(product):
            sku[normalize(key)].append(product)

        for key in (product.get("id"), product.get("product_id")):
            if key:
                reference[normalize(key)].append(product)

        names = [
            (product.get("name") or {}).get("en"),
            (product.get("name") or {}).get("fr"),
            (product.get("name") or {}).get("ar-MA"),
            product.get("original_title"),
        ]
        for name in names:
            if name:
                exact_name[normalize_exact(name)].append(product)
                normalized_name[normalize(name)].append(product)

    return sku, reference, exact_name, normalized_name


def match_product(row, indexes):
    sku, reference, exact_name, normalized_name = indexes
    checks = [
        ("SKU / Product Code", normalize(row["reference"]), sku),
        ("Product Reference", normalize(row["reference"]), reference),
        ("Exact Product Name", normalize_exact(row["name"]), exact_name),
        ("Normalized Product Name", normalize(row["name"]), normalized_name),
    ]

    for method, key, index in checks:
        if not key:
            continue
        matches = index.get(key, [])
        unique = {product["id"]: product for product in matches}
        if len(unique) == 1:
            return next(iter(unique.values())), method
        if len(unique) > 1:
            return None, f"Ambiguous {method}"
    return None, "Not Found"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--excel", required=True)
    parser.add_argument("--products", default="data/products.json")
    parser.add_argument("--reports-dir", default="logs/price-update")
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--max-unmatched-rate", type=float, default=0.05)
    args = parser.parse_args()

    excel_path = Path(args.excel)
    products_path = Path(args.products)
    reports_dir = Path(args.reports_dir)
    reports_dir.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    backup_path = reports_dir / f"products.backup.{timestamp}.json"
    detailed_path = reports_dir / "price-update-report.csv"
    unmatched_path = reports_dir / "unmatched-products.csv"
    log_path = reports_dir / "price-update.log"

    rows = read_xlsx_rows(excel_path)
    header_index, columns = detect_columns(rows)

    excel_rows = []
    for excel_row_number, values in enumerate(rows[header_index + 1 :], start=header_index + 2):
        if not any(str(value).strip() for value in values):
            continue
        get = lambda field: values[columns[field]] if columns[field] < len(values) else ""
        excel_rows.append(
            {
                "row": excel_row_number,
                "name": get("name").strip(),
                "reference": get("reference").strip(),
                "price_raw": get("price").strip(),
            }
        )

    products = json.loads(products_path.read_text(encoding="utf-8"))
    indexes = build_indexes(products)

    identity_counts = Counter(
        normalize(row["reference"]) or normalize(row["name"]) for row in excel_rows
    )

    report_rows = []
    unmatched_rows = []
    updates = []
    counts = Counter()

    for row in excel_rows:
        old_price = ""
        new_price, price_error = parse_price(row["price_raw"])
        product, match_method = match_product(row, indexes)
        duplicate = identity_counts[normalize(row["reference"]) or normalize(row["name"])] > 1

        if price_error == "empty":
            status = "Skipped"
            counts["skipped"] += 1
        elif price_error == "invalid":
            status = "Invalid Price"
            counts["invalid_prices"] += 1
        elif duplicate:
            status = "Duplicate"
            counts["duplicates"] += 1
        elif product is None:
            status = "Not Found" if match_method == "Not Found" else "Skipped"
            counts["unmatched"] += 1
            unmatched_rows.append(row)
        else:
            old_price = product.get("price", "")
            status = "Updated"
            counts["updated"] += 1
            updates.append((product, new_price))

        if product is not None:
            old_price = product.get("price", "")

        report_rows.append(
            {
                "Excel Row": row["row"],
                "Excel Product": row["name"],
                "Excel Reference": row["reference"],
                "Website Product": product_display_name(product) if product else "",
                "Website ID": product.get("id", "") if product else "",
                "Match Method": match_method,
                "Old Price": old_price,
                "New Price": new_price if new_price is not None else row["price_raw"],
                "Status": status,
            }
        )

    total = len(excel_rows)
    unmatched_rate = counts["unmatched"] / total if total else 0
    should_stop = unmatched_rate > args.max_unmatched_rate

    if args.apply and not should_stop:
        shutil.copy2(products_path, backup_path)
        for product, new_price in updates:
            product["price"] = new_price
        products_path.write_text(json.dumps(products, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        operation = "APPLIED"
    else:
        operation = "STOPPED" if should_stop else "DRY_RUN"

    with detailed_path.open("w", newline="", encoding="utf-8-sig") as file:
        fieldnames = [
            "Excel Row",
            "Excel Product",
            "Excel Reference",
            "Website Product",
            "Website ID",
            "Match Method",
            "Old Price",
            "New Price",
            "Status",
        ]
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(report_rows)

    with unmatched_path.open("w", newline="", encoding="utf-8-sig") as file:
        fieldnames = ["Excel Row", "Excel Product", "Excel Reference", "Price"]
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(
            {
                "Excel Row": row["row"],
                "Excel Product": row["name"],
                "Excel Reference": row["reference"],
                "Price": row["price_raw"],
            }
            for row in unmatched_rows
        )

    summary = {
        "operation": operation,
        "excel_file": str(excel_path),
        "products_file": str(products_path),
        "backup_file": str(backup_path) if args.apply and not should_stop else "",
        "total_products_in_excel": total,
        "successfully_updated": 0 if should_stop or not args.apply else counts["updated"],
        "would_update": counts["updated"],
        "skipped": counts["skipped"],
        "unmatched": counts["unmatched"],
        "duplicate_rows_found": counts["duplicates"],
        "invalid_prices": counts["invalid_prices"],
        "unmatched_rate": round(unmatched_rate, 4),
        "safety_threshold": args.max_unmatched_rate,
        "detailed_report": str(detailed_path),
        "unmatched_report": str(unmatched_path),
    }

    with log_path.open("w", encoding="utf-8") as file:
        file.write(json.dumps(summary, ensure_ascii=False, indent=2))
        file.write("\n\n")
        for row in report_rows:
            file.write(
                f"{row['Status']}: Excel row {row['Excel Row']} "
                f"{row['Excel Reference']} {row['Excel Product']} -> "
                f"{row['Website ID']} {row['Website Product']} "
                f"old={row['Old Price']} new={row['New Price']} method={row['Match Method']}\n"
            )

    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
