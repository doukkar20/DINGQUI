import type { Metadata } from "next";
import { Cairo, Cormorant_Garamond, Geist } from "next/font/google";
import { CartProvider } from "@/components/cart-provider";
import { CustomCursor } from "@/components/custom-cursor";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MotionProvider } from "@/components/motion-provider";
import { I18nProvider } from "@/lib/i18n";
import { publicAssetPath } from "@/lib/assets";
import { organizationSchema, siteDescription, siteName, siteTitle, websiteSchema } from "@/lib/seo";
import { ScrollProgress } from "@/components/scroll-progress";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://dingqigros.com"),
  title: {
    default: siteTitle,
    template: "%s | DINGQI GROS",
  },
  description: siteDescription,
  keywords: [
    "DINGQI GROS",
    "professional tools",
    "DingQi tools",
    "hardware tools",
    "industrial tools",
    "premium tools",
  ],
  icons: {
    icon: publicAssetPath("/logo.jpg"),
    shortcut: publicAssetPath("/logo.jpg"),
    apple: publicAssetPath("/logo.jpg"),
  },
  verification: {
    google: "Yyn-XRC5dUVpBSOxGo3Kj_gOwasE7-_A9F4AhN8HOhA",
  },
  alternates: { canonical: "/" },
  openGraph: {
    title: siteName,
    description: siteDescription,
    type: "website",
    url: "/",
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
    title: siteName,
    description: siteDescription,
    images: [publicAssetPath("/logo.jpg")],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar-MA" dir="rtl" className={`${geistSans.variable} ${cormorant.variable} ${cairo.variable}`}>
      <body>
        <ScrollProgress />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <I18nProvider>
          <MotionProvider>
            <CartProvider>
              <CustomCursor />
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </CartProvider>
          </MotionProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
