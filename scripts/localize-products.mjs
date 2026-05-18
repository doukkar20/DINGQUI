import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const productsPath = path.join(root, "data", "products.json");
const backupPath = path.join(root, "data", "products.backup.json");
const reportPath = path.join(root, "logs", "product-translation-report.txt");

const locales = ["ar-MA", "fr", "en"];

const categoryMap = {
  "Power tools accessories": {
    "ar-MA": "لوازم الأدوات الكهربائية",
    fr: "Accessoires pour outils électriques",
    en: "Power Tool Accessories",
  },
  Locks: {
    "ar-MA": "أقفال",
    fr: "Serrures",
    en: "Locks",
  },
  "Lifting and handling tools": {
    "ar-MA": "أدوات الرفع والمناولة",
    fr: "Outils de levage et de manutention",
    en: "Lifting and Handling Tools",
  },
  "Lithium battery tools": {
    "ar-MA": "أدوات ببطارية ليثيوم",
    fr: "Outils à batterie lithium",
    en: "Lithium Battery Tools",
  },
  "Hand tools": {
    "ar-MA": "أدوات يدوية",
    fr: "Outils à main",
    en: "Hand Tools",
  },
  "Garden tools": {
    "ar-MA": "أدوات الحديقة",
    fr: "Outils de jardin",
    en: "Garden Tools",
  },
  Uncategorized: {
    "ar-MA": "منتجات متنوعة",
    fr: "Produits divers",
    en: "Assorted Products",
  },
  "Fasteners and fittings tools": {
    "ar-MA": "لوازم التثبيت والتركيب",
    fr: "Fixations et accessoires",
    en: "Fasteners and Fittings",
  },
  "Pneumatic tools": {
    "ar-MA": "أدوات هوائية",
    fr: "Outils pneumatiques",
    en: "Pneumatic Tools",
  },
  "Lighting tools": {
    "ar-MA": "إضاءة العمل",
    fr: "Éclairage de chantier",
    en: "Lighting Tools",
  },
  "Pumps and machinery tools": {
    "ar-MA": "مضخات ومعدات",
    fr: "Pompes et machines",
    en: "Pumps and Machinery",
  },
  "Labour Safety tools": {
    "ar-MA": "معدات السلامة",
    fr: "Équipements de sécurité",
    en: "Safety Equipment",
  },
  "Cutter and drill Accessories": {
    "ar-MA": "لوازم القطع والثقب",
    fr: "Accessoires de coupe et perçage",
    en: "Cutting and Drilling Accessories",
  },
  "Home improvement tools": {
    "ar-MA": "أدوات الصيانة والتركيب",
    fr: "Outils de bricolage et d'installation",
    en: "Home Improvement Tools",
  },
};

const nameMap = {
  "MAGNETIC WELDING HOLDER EG02003-EG02004": {
    "ar-MA": "حامل مغناطيسي للتلحيم EG02003-EG02004",
    fr: "Support magnétique de soudage EG02003-EG02004",
    en: "Magnetic Welding Holder EG02003-EG02004",
  },
  "IRON PADLOCK 151232-151275": {
    "ar-MA": "قفل حديدي 151232-151275",
    fr: "Cadenas en fer 151232-151275",
    en: "Iron Padlock 151232-151275",
  },
  "SHELF BRACKET GA04001-GA04006": {
    "ar-MA": "دعامة رف GA04001-GA04006",
    fr: "Support d'étagère GA04001-GA04006",
    en: "Shelf Bracket GA04001-GA04006",
  },
  "CORDLESS AIR PUMP JE11401": {
    "ar-MA": "مضخة هواء ببطارية JE11401",
    fr: "Pompe à air sans fil JE11401",
    en: "Cordless Air Pump JE11401",
  },
  "CORDLESS BLOWER JE08001": {
    "ar-MA": "منفاخ ببطارية JE08001",
    fr: "Souffleur sans fil JE08001",
    en: "Cordless Blower JE08001",
  },
  "RATCHET WRENCH 14103-14104": {
    "ar-MA": "مفتاح راتشي 14103-14104",
    fr: "Clé à cliquet 14103-14104",
    en: "Ratchet Wrench 14103-14104",
  },
  "MINI COMBINATION PLIERS 21001": {
    "ar-MA": "زرادية صغيرة متعددة الاستعمال 21001",
    fr: "Mini pince universelle 21001",
    en: "Mini Combination Pliers 21001",
  },
  "TOWER PINCER BLACK WITH ORANGE 24001": {
    "ar-MA": "كماشة تاور كحلة وبرتقالية 24001",
    fr: "Tenaille tower noire et orange 24001",
    en: "Tower Pincer Black with Orange 24001",
  },
  "END CUTTING PLIERS WITH HEAD CARD 24106-24108": {
    "ar-MA": "كماشة قطع أمامي 24106-24108",
    fr: "Pince coupante frontale 24106-24108",
    en: "End Cutting Pliers 24106-24108",
  },
  "FITTER HAMMER 31102-31120": {
    "ar-MA": "مطرقة ميكانيكي 31102-31120",
    fr: "Marteau de mécanicien 31102-31120",
    en: "Fitter Hammer 31102-31120",
  },
  "TUBE CUTTER 63009": {
    "ar-MA": "قطاعة الأنابيب 63009",
    fr: "Coupe-tube 63009",
    en: "Tube Cutter 63009",
  },
  "UTILITY KNIFE 63112": {
    "ar-MA": "كتر 63112",
    fr: "Cutter 63112",
    en: "Utility Knife 63112",
  },
  "CLOCK SCREWDRIVER SET FH1001": {
    "ar-MA": "طقم مفكات دقيقة FH1001",
    fr: "Jeu de tournevis de précision FH1001",
    en: "Precision Screwdriver Set FH1001",
  },
  "SET 5 ALLEN SCHLUSSEL 1071005": {
    "ar-MA": "طقم 5 مفاتيح ألان 1071005",
    fr: "Jeu de 5 clés Allen 1071005",
    en: "Set of 5 Allen Keys 1071005",
  },
  "SPARK PLUG WRENCH 19113": {
    "ar-MA": "مفتاح البوجي 19113",
    fr: "Clé à bougie 19113",
    en: "Spark Plug Wrench 19113",
  },
  "RUBBER HAMMER CE01435": {
    "ar-MA": "مطرقة مطاطية CE01435",
    fr: "Maillet en caoutchouc CE01435",
    en: "Rubber Hammer CE01435",
  },
  "HOE AF80301": {
    "ar-MA": "فأس صغير للحديقة AF80301",
    fr: "Binette AF80301",
    en: "Hoe AF80301",
  },
  "MAGNETIC SCREW DRIVER BIT AL02401": {
    "ar-MA": "رأس مفك مغناطيسي AL02401",
    fr: "Embout de tournevis magnétique AL02401",
    en: "Magnetic Screwdriver Bit AL02401",
  },
  "SCREWDRIVER BIT 68013": {
    "ar-MA": "رأس مفك 68013",
    fr: "Embout de tournevis 68013",
    en: "Screwdriver Bit 68013",
  },
  "GALSS KNIFE 63105": {
    "ar-MA": "قطاعة الزجاج 63105",
    fr: "Coupe-verre 63105",
    en: "Glass Knife 63105",
  },
  "RUBBER HAMMER 35008 35024": {
    "ar-MA": "مطرقة مطاطية 35008 35024",
    fr: "Maillet en caoutchouc 35008 35024",
    en: "Rubber Hammer 35008 35024",
  },
  "GARDEN SCISSORS 44208 44210": {
    "ar-MA": "مقص الحديقة 44208 44210",
    fr: "Sécateur de jardin 44208 44210",
    en: "Garden Scissors 44208 44210",
  },
  "HEDGE SHEARS 40401001": {
    "ar-MA": "مقص السياج 40401001",
    fr: "Cisaille à haies 40401001",
    en: "Hedge Shears 40401001",
  },
  "5 LINE LASER LEVEL EC03802": {
    "ar-MA": "ميزان ليزر 5 خطوط EC03802",
    fr: "Niveau laser 5 lignes EC03802",
    en: "5 Line Laser Level EC03802",
  },
  "EXPANSION SCREW KJ00600": {
    "ar-MA": "برغي تمدد KJ00600",
    fr: "Vis d'expansion KJ00600",
    en: "Expansion Screw KJ00600",
  },
  "HEAVY DUTY STAPLE GUN 113001": {
    "ar-MA": "دباسة قوية 113001",
    fr: "Agrafeuse robuste 113001",
    en: "Heavy Duty Staple Gun 113001",
  },
  "HAND RIVETER KB01001-KB01003": {
    "ar-MA": "ماكينة برشام يدوية KB01001-KB01003",
    fr: "Pince à riveter manuelle KB01001-KB01003",
    en: "Hand Riveter KB01001-KB01003",
  },
  "SCREWDRIVER SET 68001": {
    "ar-MA": "طقم مفكات 68001",
    fr: "Jeu de tournevis 68001",
    en: "Screwdriver Set 68001",
  },
  "ROLLER TYPE TUBE CUTTER FC01401": {
    "ar-MA": "قطاعة أنابيب بالرول FC01401",
    fr: "Coupe-tube à galet FC01401",
    en: "Roller Type Tube Cutter FC01401",
  },
  "FLOODING LIGHT BATTERY VERSION RA02405": {
    "ar-MA": "كشاف ضو ببطارية RA02405",
    fr: "Projecteur à batterie RA02405",
    en: "Battery Flood Light RA02405",
  },
  "RATCHETING SCREWDRIVER SET 68647": {
    "ar-MA": "طقم مفك راتشي 68647",
    fr: "Jeu de tournevis à cliquet 68647",
    en: "Ratcheting Screwdriver Set 68647",
  },
  "AIR SPRAY GUN KITS 121009": {
    "ar-MA": "طقم مسدس صباغة هوائي 121009",
    fr: "Kit pistolet de peinture pneumatique 121009",
    en: "Air Spray Gun Kit 121009",
  },
  "HEX SHANK AUGER 1333008 1333016": {
    "ar-MA": "مثقاب خشب بساق سداسية 1333008 1333016",
    fr: "Mèche tarière à queue hexagonale 1333008 1333016",
    en: "Hex Shank Auger 1333008 1333016",
  },
  "AIR COMPRESSOR 10080103 10080110": {
    "ar-MA": "كمبريسور هواء 10080103 10080110",
    fr: "Compresseur d'air 10080103 10080110",
    en: "Air Compressor 10080103 10080110",
  },
  "TOOLS BOX SET 101001111": {
    "ar-MA": "طقم أدوات مع صندوق 101001111",
    fr: "Coffret d'outils 101001111",
    en: "Tool Box Set 101001111",
  },
  "ROUND SANDER JC05403": {
    "ar-MA": "صنفرة دائرية JC05403",
    fr: "Ponceuse ronde JC05403",
    en: "Round Sander JC05403",
  },
  "FLAMETHROWER 12003SW307": {
    "ar-MA": "مشعل غاز 12003SW307",
    fr: "Chalumeau à gaz 12003SW307",
    en: "Gas Torch 12003SW307",
  },
  "ALTERNATOR VC02312": {
    "ar-MA": "مولد كهربائي VC02312",
    fr: "Alternateur VC02312",
    en: "Alternator VC02312",
  },
  "GASOLINE SAW GUIDE BARD G02401-DG02406 DZ04401": {
    "ar-MA": "سكة منشار بنزين G02401-DG02406 DZ04401",
    fr: "Guide de scie à essence G02401-DG02406 DZ04401",
    en: "Gasoline Saw Guide Bar G02401-DG02406 DZ04401",
  },
  "HEAT GUN LA01403": {
    "ar-MA": "مسدس هواء سخون LA01403",
    fr: "Décapeur thermique LA01403",
    en: "Heat Gun LA01403",
  },
  "WOOD CHISEL 37025A": {
    "ar-MA": "إزميل الخشب 37025A",
    fr: "Ciseau à bois 37025A",
    en: "Wood Chisel 37025A",
  },
  "UTILITY KNIFE FC03201": {
    "ar-MA": "كتر FC03201",
    fr: "Cutter FC03201",
    en: "Utility Knife FC03201",
  },
  "ROUND CHAIN SAW CHAIN DG02101-DG02103": {
    "ar-MA": "سلسلة منشار دائري DG02101-DG02103",
    fr: "Chaîne de tronçonneuse ronde DG02101-DG02103",
    en: "Round Chain Saw Chain DG02101-DG02103",
  },
  "HEDGE SHEARS 40401003": {
    "ar-MA": "مقص السياج 40401003",
    fr: "Cisaille à haies 40401003",
    en: "Hedge Shears 40401003",
  },
  "RECIPROCATING SAW BLADE DG0101 DG0102": {
    "ar-MA": "شفرة منشار ترددي DG0101 DG0102",
    fr: "Lame de scie sabre DG0101 DG0102",
    en: "Reciprocating Saw Blade DG0101 DG0102",
  },
  "GARDEN SCISSORS 44212": {
    "ar-MA": "مقص الحديقة 44212",
    fr: "Sécateur de jardin 44212",
    en: "Garden Scissors 44212",
  },
  "PLASTIC SPRAY NOZZLE 48003": {
    "ar-MA": "رأس رش بلاستيك 48003",
    fr: "Buse de pulvérisation plastique 48003",
    en: "Plastic Spray Nozzle 48003",
  },
  "GLUE GUN 124100": {
    "ar-MA": "مسدس السيليكون 124100",
    fr: "Pistolet à colle 124100",
    en: "Glue Gun 124100",
  },
  "G CLAMP 75302-75308": {
    "ar-MA": "مشبك G 75302-75308",
    fr: "Serre-joint G 75302-75308",
    en: "G Clamp 75302-75308",
  },
  "BENCH VICE NODULAR CAST IRON 75100-75150": {
    "ar-MA": "منجلة طابلة من حديد قوي 75100-75150",
    fr: "Étau d'établi en fonte nodulaire 75100-75150",
    en: "Nodular Cast Iron Bench Vice 75100-75150",
  },
  "PVC WELDING MACHINE 63004": {
    "ar-MA": "ماكينة تلحيم PVC 63004",
    fr: "Machine à souder PVC 63004",
    en: "PVC Welding Machine 63004",
  },
  "AUTO-DARKENING WELDING HELMET 91201": {
    "ar-MA": "قناع تلحيم أوتوماتيكي 91201",
    fr: "Masque de soudage automatique 91201",
    en: "Auto-Darkening Welding Helmet 91201",
  },
  "HAND SCREWS EXTRACTOR MF1006-MF1012": {
    "ar-MA": "مستخرج البراغي اليدوي MF1006-MF1012",
    fr: "Extracteur de vis manuel MF1006-MF1012",
    en: "Hand Screw Extractor MF1006-MF1012",
  },
  "MIXING BAR LF01201-LF01202": {
    "ar-MA": "عود خلط LF01201-LF01202",
    fr: "Tige de mélange LF01201-LF01202",
    en: "Mixing Bar LF01201-LF01202",
  },
  "MIXING BAR LF01101": {
    "ar-MA": "عود خلط LF01101",
    fr: "Tige de mélange LF01101",
    en: "Mixing Bar LF01101",
  },
  "HINGE BORING BIT 136315-136360": {
    "ar-MA": "ريشة ثقب المفصلات 136315-136360",
    fr: "Mèche pour charnières 136315-136360",
    en: "Hinge Boring Bit 136315-136360",
  },
  "CORDLESS AIR PUMP JE11402": {
    "ar-MA": "مضخة هواء ببطارية JE11402",
    fr: "Pompe à air sans fil JE11402",
    en: "Cordless Air Pump JE11402",
  },
  "CORDLESS PRESSURE WASHER JE09001": {
    "ar-MA": "غسالة ضغط ببطارية JE09001",
    fr: "Nettoyeur haute pression sans fil JE09001",
    en: "Cordless Pressure Washer JE09001",
  },
  "CORDLESS DRILL 10050302": {
    "ar-MA": "دريل ببطارية 10050302",
    fr: "Perceuse sans fil 10050302",
    en: "Cordless Drill 10050302",
  },
};

const specLabelMap = {
  "CODE#": { "ar-MA": "الكود", fr: "Code", en: "Code" },
  SPEC: { "ar-MA": "المواصفة", fr: "Spécification", en: "Specification" },
  QTY: { "ar-MA": "الكمية", fr: "Quantité", en: "Quantity" },
  "㎡": { "ar-MA": "الحجم", fr: "Volume", en: "Volume" },
  "ãŽ¡": { "ar-MA": "الحجم", fr: "Volume", en: "Volume" },
  "G.W": { "ar-MA": "الوزن الإجمالي", fr: "Poids brut", en: "Gross Weight" },
};

function localized(value, fallback = "") {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return locales.reduce((acc, locale) => {
      acc[locale] = String(value[locale] || value.en || fallback || "");
      return acc;
    }, {});
  }

  const text = String(value || fallback || "");
  return { "ar-MA": text, fr: text, en: text };
}

function keepExisting(existing, generated) {
  const current = localized(existing);
  return locales.reduce((acc, locale) => {
    acc[locale] = current[locale] && current[locale] !== current.en ? current[locale] : generated[locale];
    return acc;
  }, {});
}

function slugify(text) {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function arabicSlug(text, id) {
  return `${text.replace(/\s+/g, "-").replace(/[^\u0600-\u06FFa-zA-Z0-9-]+/g, "")}-${id}`;
}

function extractSku(product, title) {
  if (product.sku) return product.sku;
  const code = product.specifications?.records?.[0]?.["CODE#"] || product.specifications?.rows?.[0]?.[0];
  const titleCodes = title.match(/[A-Z]{1,4}\d[A-Z0-9-]*(?:\s+[A-Z]{1,4}\d[A-Z0-9-]*)*|\d{4,}(?:[-\s]\d{4,})*/g);
  return titleCodes?.at(-1)?.trim() || code || product.product_id || product.id;
}

function makeDescriptions(name, category) {
  return {
    shortDescription: {
      "ar-MA": `${name["ar-MA"]} من DingQi، مناسب للخدمة المهنية واليومية.`,
      fr: `${name.fr} DingQi, adapté aux usages professionnels et quotidiens.`,
      en: `${name.en} by DingQi, suitable for professional and daily use.`,
    },
    description: {
      "ar-MA": `${name["ar-MA"]} من DingQi بجودة موثوقة، موجه للحرفيين والمحلات فالاستعمال اليومي. شوف المواصفات باش تختار القياس المناسب.`,
      fr: `${name.fr} DingQi avec une qualité fiable pour les ateliers, les chantiers et les revendeurs. Consultez les spécifications pour choisir la bonne référence.`,
      en: `${name.en} from DingQi with dependable quality for workshops, job sites, and trade counters. Check the specifications to choose the right reference.`,
    },
    seo: {
      title: {
        "ar-MA": `${name["ar-MA"]} | DINGQI GROS المغرب`,
        fr: `${name.fr} | DINGQI GROS Maroc`,
        en: `${name.en} | DINGQI GROS Morocco`,
      },
      description: {
        "ar-MA": `${name["ar-MA"]} من فئة ${category["ar-MA"]}. طلب الثمن والتوصيل فالمغرب عبر DINGQI GROS.`,
        fr: `${name.fr} dans la catégorie ${category.fr}. Demandez le prix et la livraison au Maroc avec DINGQI GROS.`,
        en: `${name.en} in ${category.en}. Request pricing and delivery in Morocco from DINGQI GROS.`,
      },
    },
  };
}

function normalizeSpecs(product) {
  const original = product.specificationTable || product.specifications || { headers: [], rows: [], records: [] };
  const headers = Array.isArray(original.headers) ? original.headers : [];
  const rows = Array.isArray(original.rows) ? original.rows : [];
  const localizedHeaders = headers.map((header) => specLabelMap[header] || localized(header));
  const specificationRows = rows.map((row) =>
    row.map((value, index) => ({
      label: localizedHeaders[index] || localized(`Column ${index + 1}`),
      value: String(value || ""),
    })),
  );
  const flat = specificationRows[0] || [];

  return {
    specifications: flat,
    specificationRows,
    specificationTable: {
      headers: localizedHeaders,
      rows,
      records: Array.isArray(original.records) ? original.records : [],
    },
  };
}

function getBaseTitle(product) {
  return typeof product.name === "object" ? product.name.en : product.title || "";
}

if (!existsSync(backupPath)) {
  copyFileSync(productsPath, backupPath);
}

const originalProducts = JSON.parse(readFileSync(productsPath, "utf8"));
const report = [];
let translated = 0;
let preserved = 0;

const products = originalProducts.map((product) => {
  const oldTitle = getBaseTitle(product);
  const name = nameMap[oldTitle] || {
    "ar-MA": oldTitle,
    fr: oldTitle,
    en: oldTitle,
  };
  const categoryKey = product.categoryKey || (typeof product.category === "string" ? product.category : product.original_category || product.category?.en || "Uncategorized");
  const category = categoryMap[categoryKey] || categoryMap.Uncategorized;
  const sku = extractSku(product, oldTitle);
  const routeSlug = product.route_slug || (typeof product.slug === "string" ? product.slug : product.slug?.en || slugify(`${name.en}-${product.id}`));
  const slug = {
    "ar-MA": arabicSlug(name["ar-MA"], product.id),
    fr: `${slugify(name.fr)}-${product.id}`,
    en: `${slugify(name.en)}-${product.id}`,
  };
  const descriptions = makeDescriptions(name, category);
  const specs = normalizeSpecs(product);
  const imageAlt = {
    "ar-MA": `صورة ${name["ar-MA"]}`,
    fr: `Image ${name.fr}`,
    en: `${name.en} image`,
  };

  const wasLocalized = typeof product.name === "object" && typeof product.category === "object";
  if (wasLocalized) preserved += 1;
  translated += 1;

  report.push(
    `- ${product.id}: ${oldTitle}`,
    `  ar-MA: ${name["ar-MA"]}`,
    `  fr: ${name.fr}`,
    `  en: ${name.en}`,
  );

  const {
    title,
    original_title,
    original_category,
    ...rest
  } = product;

  return {
    ...rest,
    id: String(product.id),
    product_id: String(product.product_id || product.id),
    sku,
    source_url: product.source_url || "",
    route_slug: routeSlug,
    slug: keepExisting(product.slug, slug),
    name: keepExisting(product.name, name),
    categoryKey,
    category: keepExisting(product.category, category),
    shortDescription: keepExisting(product.shortDescription, descriptions.shortDescription),
    description: keepExisting(product.description, descriptions.description),
    ...specs,
    seo: {
      title: keepExisting(product.seo?.title, descriptions.seo.title),
      description: keepExisting(product.seo?.description, descriptions.seo.description),
    },
    imageAlt: keepExisting(product.imageAlt, imageAlt),
    images: product.images || [],
    price: product.price ?? "",
    imported_at: product.imported_at || "",
    original_title: original_title || title || name.en,
    original_category: original_category || categoryKey,
  };
});

mkdirSync(path.dirname(reportPath), { recursive: true });
writeFileSync(productsPath, `${JSON.stringify(products, null, 2)}\n`, "utf8");
writeFileSync(
  reportPath,
  [
    "DINGQI GROS product translation report",
    `Generated: ${new Date().toISOString()}`,
    "",
    `Products processed: ${products.length}`,
    `Products localized: ${translated}`,
    `Existing localized products preserved: ${preserved}`,
    `Duplicates created: 0`,
    `Errors: 0`,
    "",
    "Localized products:",
    ...report,
    "",
  ].join("\n"),
  "utf8",
);
