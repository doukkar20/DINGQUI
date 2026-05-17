import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { LocalizedLink, T } from "@/lib/i18n";
import { categoryToSlug, getCategories, getProductsByCategory } from "@/lib/products";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse DINGQI GROS product categories imported from DingQi.",
};

export default function CategoriesPage() {
  const categories = getCategories();

  return (
    <>
      <section className="border-b border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-sm text-gold"><T k="nav.categories" /></p>
          <h1 className="mt-2 max-w-4xl font-serif text-6xl font-semibold leading-none text-white">
            <T k="categories.title" />
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
            <T k="categories.copy" />
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-2 lg:px-8">
        {categories.map((category) => {
          const products = getProductsByCategory(category.name);
          return (
            <article key={category.name} className="glass-card overflow-hidden">
              <LocalizedLink href={`/shop?category=${categoryToSlug(category.name)}`} className="grid gap-0 sm:grid-cols-[210px_1fr]">
                <div className="relative min-h-56 bg-white">
                  {category.image && (
                    <Image src={category.image} alt={category.name} fill sizes="(min-width: 768px) 210px, 100vw" className="object-contain p-5" />
                  )}
                </div>
                <div className="p-6">
                  <p className="text-sm text-gold"><T k="home.productsCount" values={{ count: category.count }} /></p>
                  <h2 className="mt-2 font-serif text-4xl font-semibold text-white">{category.name}</h2>
                  <div className="mt-5 grid gap-2">
                    {products.slice(0, 3).map((product) => (
                      <p key={product.id} className="line-clamp-1 text-sm text-muted">
                        {product.title}
                      </p>
                    ))}
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold">
                    <T k="categories.view" />
                    <ArrowRight size={16} />
                  </span>
                </div>
              </LocalizedLink>
            </article>
          );
        })}
      </section>
    </>
  );
}
