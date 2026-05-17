export type SpecificationTable = {
  headers: string[];
  rows: string[][];
  records: Record<string, string>[];
};

export type Product = {
  id: string;
  product_id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  specifications: SpecificationTable;
  images: string[];
  source_url: string;
  price: string;
  imported_at: string;
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
