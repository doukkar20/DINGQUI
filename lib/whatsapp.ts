import type { CartItem, CheckoutDetails, LanguageCode, Product, ReservationDetails } from "@/lib/types";
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
  language?: LanguageCode;
};

const labels = {
  en: {
    intro: "Hello, I want to place a request from DINGQI GROS.",
    fullName: "Full name:",
    phone: "Phone:",
    city: "City:",
    product: "Product:",
    quantity: "Quantity:",
    productDetails: "Product details:",
    cartSummary: "Cart summary:",
    cartOrder: "Cart order",
    thanks: "Thank you.",
  },
  fr: {
    intro: "Bonjour, je souhaite envoyer une demande à DINGQI GROS.",
    fullName: "Nom complet :",
    phone: "Téléphone :",
    city: "Ville :",
    product: "Produit :",
    quantity: "Quantité :",
    productDetails: "Détails du produit :",
    cartSummary: "Résumé du panier :",
    cartOrder: "Commande du panier",
    thanks: "Merci.",
  },
  "ar-MA": {
    intro: "السلام عليكم، أود إرسال طلب من موقع DINGQI GROS.",
    fullName: "الاسم الكامل:",
    phone: "رقم الهاتف:",
    city: "المدينة:",
    product: "المنتج:",
    quantity: "الكمية:",
    productDetails: "تفاصيل المنتج:",
    cartSummary: "ملخص السلة:",
    cartOrder: "طلب من السلة",
    thanks: "شكرا.",
  },
} as const;

export function createReservationMessage({
  details,
  product,
  cartLines = [],
  language = "ar-MA",
}: ReservationMessageOptions): string {
  const copy = labels[language];
  const lines = [
    copy.intro,
    "",
    copy.fullName,
    details.fullName,
    copy.phone,
    details.phone,
    copy.city,
    details.city,
  ];

  if (details.productName) {
    lines.push("", copy.product, details.productName);
  }

  if (details.quantity) {
    lines.push(copy.quantity, details.quantity);
  }

  if (product) {
    lines.push(
      "",
      copy.productDetails,
      `${getProductName(product, language)} | ID: ${product.product_id}`,
      product.source_url,
    );
  }

  if (cartLines.length) {
    lines.push("", copy.cartSummary, ...cartLines);
  }

  lines.push("", copy.thanks);

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
  return createLocalizedCartLines(items, products, "ar-MA");
}

export function createLocalizedCartLines(items: CartItem[], products: Product[], language: LanguageCode): string[] {
  const quantityLabel = labels[language].quantity.replace(":", "");
  return items.map((item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return product
      ? `- ${getProductName(product, language)} | ID: ${product.product_id} | ${quantityLabel}: ${item.quantity}`
      : `- Product ID: ${item.productId} | ${quantityLabel}: ${item.quantity}`;
  });
}

export function createOrderMessage(
  items: CartItem[],
  products: Product[],
  details?: CheckoutDetails,
  language: LanguageCode = "ar-MA",
): string {
  const cartLines = createLocalizedCartLines(items, products, language);

  return createReservationMessage({
    details: {
      fullName: details?.fullName || "",
      phone: details?.phone || "",
      city: details?.city || "",
      address: "",
      productName: cartLines.length ? labels[language].cartOrder : "",
      quantity: cartLines.length ? String(items.reduce((total, item) => total + item.quantity, 0)) : "",
      notes: "",
    },
    cartLines,
    language,
  });
}
