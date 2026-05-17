import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <div className="glass-panel p-10">
        <p className="text-sm text-gold">404</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold text-white">Page not found</h1>
        <p className="mt-4 text-muted">The page you are looking for is not available.</p>
        <Link href="/shop" className="btn-gold mt-8">
          Return to shop
        </Link>
      </div>
    </section>
  );
}
