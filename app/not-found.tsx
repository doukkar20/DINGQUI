import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Page not found | DINGQI GROS" },
  description: "The requested DINGQI GROS page could not be found.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <div className="glass-panel p-10">
        <p className="text-sm text-orange">404</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold text-foreground">Page not found</h1>
        <p className="mt-4 text-muted">The page you are looking for is not available.</p>
        <Link href="/shop" className="btn-primary mt-8">
          Return to shop
        </Link>
      </div>
    </section>
  );
}
