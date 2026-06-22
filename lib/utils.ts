export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(price: string | number | null | undefined, fallback = "Price on request"): string {
  if (typeof price === "number") {
    return `${price.toLocaleString("fr-MA")} DH`;
  }

  return price?.trim() || fallback;
}
