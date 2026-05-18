import type { Metadata } from "next";
import { Suspense } from "react";
import { Cairo, Cormorant_Garamond, Geist } from "next/font/google";
import { CartProvider } from "@/components/cart-provider";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { I18nProvider } from "@/lib/i18n";
import { publicAssetPath } from "@/lib/assets";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://dingqi-gros.vercel.app"),
  title: {
    default: "DINGQI GROS | DingQi Tools Morocco",
    template: "%s | DINGQI GROS",
  },
  description:
    "DINGQI GROS is a black and gold DingQi tools storefront in Morocco with WhatsApp ordering and reservation requests.",
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
  openGraph: {
    title: "DINGQI GROS",
    description: "DingQi tools, reservations, and WhatsApp ordering in Morocco",
    type: "website",
    url: "/",
    siteName: "DINGQI GROS",
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
        <Suspense>
          <I18nProvider>
            <CartProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </CartProvider>
          </I18nProvider>
        </Suspense>
      </body>
    </html>
  );
}
