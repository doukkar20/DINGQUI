import type { Metadata } from "next";
import { publicAssetPath } from "@/lib/assets";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dingqi-gros.vercel.app";
export const siteName = "DINGQI GROS";
export const siteTitle = "DINGQI GROS | DingQi Tools Morocco";
export const siteDescription =
  "DINGQI GROS is a Moroccan DingQi tools catalog for professional buyers, with fast WhatsApp ordering, delivery support, and quote requests.";

export const languageAlternates = {
  "ar-MA": "/",
  en: "/?lang=en",
  fr: "/?lang=fr",
};

type PageSeoOptions = {
  title: string;
  description: string;
  path?: string;
};

export function pageMetadata({ title, description, path = "/" }: PageSeoOptions): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: languageAlternates,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: path,
      siteName,
      images: [
        {
          url: publicAssetPath("/logo.jpg"),
          width: 800,
          height: 800,
          alt: siteName,
        },
      ],
      locale: "ar_MA",
      alternateLocale: ["en_US", "fr_FR"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [publicAssetPath("/logo.jpg")],
    },
  };
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: siteName,
  url: siteUrl,
  image: `${siteUrl}${publicAssetPath("/logo.jpg")}`,
  email: "dingqigros@gmail.com",
  telephone: "+212626018950",
  areaServed: "Morocco",
  address: {
    "@type": "PostalAddress",
    addressCountry: "MA",
  },
  sameAs: ["https://wa.me/212626018950"],
};
