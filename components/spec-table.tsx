"use client";

import type { SpecificationTable } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { getLocalizedText } from "@/lib/products";

type SpecTableProps = {
  specifications: SpecificationTable;
};

export function SpecTable({ specifications }: SpecTableProps) {
  const { direction, language, t } = useI18n();
  if (!specifications.rows.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-muted">
        {t("product.noSpecs")}
      </div>
    );
  }

  const headers = specifications.headers.length
    ? specifications.headers
    : specifications.rows[0].map((_, index) => ({ [language]: t("product.column", { count: index + 1 }) }));
  const localizedHeaders = headers.map((header) => getLocalizedText(header, language));

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-sm" dir={direction}>
          <thead className="bg-orange text-white">
            <tr>
              {localizedHeaders.map((header) => (
                <th key={header} className="px-5 py-4 font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specifications.rows.map((row, rowIndex) => (
              <tr key={`${row.join("-")}-${rowIndex}`} className="border-t border-gray-200">
                {localizedHeaders.map((header, columnIndex) => (
                  <td key={`${header}-${columnIndex}`} className="px-5 py-4 text-muted">
                    {row[columnIndex] || ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
