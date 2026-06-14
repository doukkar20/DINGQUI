import type { Metadata } from "next";
import { publicAssetPath } from "@/lib/assets";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dingqigros.com";
export const siteName = "DINGQI GROS";
export const siteTitle = "DINGQI GROS Maroc | أدوات DINGQI الأصلية";
export const siteDescription =
  "متجر DINGQI بالمغرب للبيع بالجملة والتقسيط: أدوات ومعدات صناعية أصلية، عروض أسعار سريعة، وتوصيل مجاني لجميع المدن المغربية.";

type PageSeoOptions = {
  title: string;
  description: string;
  path?: string;
  index?: boolean;
};

export function pageMetadata({ title, description, path = "/", index = true }: PageSeoOptions): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: path,
    },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: true, googleBot: { index: false, follow: true } },
    openGraph: {
      title,
      description,
      type: "website",
      url: path,
      siteName,
      images: [
        {
          url: publicAssetPath("/logo.jpg"),
          width: 1280,
          height: 720,
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
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: siteName,
  url: siteUrl,
  logo: `${siteUrl}${publicAssetPath("/logo.jpg")}`,
  image: `${siteUrl}${publicAssetPath("/logo.jpg")}`,
  description: siteDescription,
  email: "dingqigros@gmail.com",
  telephone: "+212626018950",
  areaServed: {
    "@type": "Country",
    name: "Morocco",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+212626018950",
    contactType: "sales",
    areaServed: "MA",
    availableLanguage: ["Arabic", "French", "English"],
  },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: siteName,
  description: siteDescription,
  publisher: {
    "@id": `${siteUrl}/#organization`,
  },
};
