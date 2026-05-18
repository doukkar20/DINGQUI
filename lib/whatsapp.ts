import type { CartItem, CheckoutDetails, Product, ReservationDetails } from "@/lib/types";
import { getProductName } from "@/lib/products";

export const whatsappNumber = "212626018950";
export const displayPhoneNumber = "0626-018950";

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

type ReservationMessageOptions = {
  details: ReservationDetails;
  product?: Product;
  cartLines?: string[];
};

export function createReservationMessage({
  details,
  product,
  cartLines = [],
}: ReservationMessageOptions): string {
  const lines = [
    "السلام عليكم، بغيت ندير طلب من موقع DINGQI GROS.",
    "",
    "الاسم الكامل:",
    details.fullName,
    "رقم الهاتف:",
    details.phone,
    "المدينة:",
    details.city,
    "العنوان:",
    details.address,
    "المنتج:",
    details.productName,
    "الكمية:",
    details.quantity,
    "ملاحظات:",
    details.notes || "-",
  ];

  if (product) {
    lines.push(
      "",
      "تفاصيل المنتج:",
      `${getProductName(product, "ar-MA")} | ID: ${product.product_id}`,
      product.source_url,
    );
  }

  if (cartLines.length) {
    lines.push("", "ملخص السلة:", ...cartLines);
  }

  lines.push("", "شكراً.");

  return lines.join("\n");
}

export function createProductMessage(product: Product, quantity = 1): string {
  return createReservationMessage({
    details: {
      fullName: "",
      phone: "",
      city: "",
      address: "",
      productName: getProductName(product, "ar-MA"),
      quantity: String(quantity),
      notes: "",
    },
    product,
  });
}

export function createCartLines(items: CartItem[], products: Product[]): string[] {
  return items.map((item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return product
      ? `- ${getProductName(product, "ar-MA")} | ID: ${product.product_id} | الكمية: ${item.quantity}`
      : `- Product ID: ${item.productId} | الكمية: ${item.quantity}`;
  });
}

export function createOrderMessage(
  items: CartItem[],
  products: Product[],
  details?: CheckoutDetails,
): string {
  const cartLines = createCartLines(items, products);

  return createReservationMessage({
    details: {
      fullName: details?.fullName || "",
      phone: details?.phone || "",
      city: details?.city || "",
      address: details?.address || "",
      productName: cartLines.length ? "طلب من السلة" : "",
      quantity: cartLines.length ? String(items.reduce((total, item) => total + item.quantity, 0)) : "",
      notes: details?.notes || "",
    },
    cartLines,
  });
}
