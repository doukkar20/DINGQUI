import { publicAssetPath } from "@/lib/assets";
import type { Language } from "@/lib/i18n";

export const winningProducts = [
  { name: { en: "Air Compressor", fr: "Compresseur d'air", "ar-MA": "ضاغط هواء" }, ref: "10812", price: "1,000 DHS" },
  { name: { en: "Angle Grinder", fr: "Meuleuse d'angle", "ar-MA": "صاروخ تقطيع" }, ref: "JB02402", price: "170 DHS" },
  { name: { en: "Horizontal Jack", fr: "Cric horizontal", "ar-MA": "رافعة أفقية" }, ref: "GA11403", price: "1,000 DHS" },
  { name: { en: "Inverter Welding Machine", fr: "Poste à souder inverter", "ar-MA": "آلة لحام إنفرتر" }, ref: "JM14300", price: "850 DHS" },
  { name: { en: "Iron Shovel Head", fr: "Tête de pelle en fer", "ar-MA": "رأس مجرفة حديد" }, ref: "38029", price: "30 DHS" },
  { name: { en: "16 Line Laser Level", fr: "Niveau laser 16 lignes", "ar-MA": "ميزان ليزر 16 خط" }, ref: "EC03801", price: "600 DHS" },
  { name: { en: "Multi-Function Jump Starter", fr: "Démarreur multifonction", "ar-MA": "شاحن تشغيل متعدد الوظائف" }, ref: "HZ02001", price: "450 DHS" },
  { name: { en: "Professional Tile Cutter", fr: "Coupe-carreaux professionnel", "ar-MA": "قاطعة سيراميك احترافية" }, ref: "6436", price: "320 DHS" },
] as const;

export type WinningProduct = (typeof winningProducts)[number];

export function getWinningProductImage(ref: string) {
  return publicAssetPath(`/images/products/${ref}.webp`);
}

export function getWinningProductName(product: WinningProduct, language: Language) {
  return product.name[language] || product.name.en;
}

export function getWinningProductPrice(product: WinningProduct, language: Language) {
  return language === "ar-MA" ? product.price.replace("DHS", "درهم") : product.price;
}
