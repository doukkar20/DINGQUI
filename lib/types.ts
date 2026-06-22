export type LanguageCode = "ar-MA" | "fr" | "en";

export type LocalizedText = Partial<Record<LanguageCode, string>>;

export type LocalizedSpecification = {
  label: LocalizedText;
  value: string;
};

export type SpecificationTable = {
  headers: LocalizedText[];
  rows: string[][];
  records: Record<string, string>[];
};

export type Product = {
  id: string;
  product_id: string;
  sku?: string;
  route_slug: string;
  slug: LocalizedText;
  name: LocalizedText;
  categoryKey: string;
  category: LocalizedText;
  shortDescription: LocalizedText;
  description: LocalizedText;
  specifications: LocalizedSpecification[];
  specificationRows: LocalizedSpecification[][];
  specificationTable: SpecificationTable;
  seo?: {
    title?: LocalizedText;
    description?: LocalizedText;
  };
  imageAlt?: LocalizedText;
  images: string[];
  source_url: string;
  price: string | number;
  imported_at: string;
  original_title?: string;
  original_category?: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type CheckoutDetails = {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
};

export type ReservationDetails = CheckoutDetails & {
  productName: string;
  quantity: string;
};
