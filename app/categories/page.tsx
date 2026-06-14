import type { Metadata } from "next";
import { CategoryCard } from "@/components/category-card";
import { T } from "@/lib/i18n";
import { getCategories, getProductsByCategory } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "فئات أدوات ومعدات DINGQI | DINGQI GROS المغرب",
  description: "اكتشف فئات أدوات DINGQI المهنية للورش والمحلات ومواقع العمل بالمغرب، من العدد اليدوية إلى المعدات الكهربائية والصناعية.",
  path: "/categories",
});

export default function CategoriesPage() {
  const categories = getCategories();

  return (
    <>
      <section className="premium-shell border-b border-white/10">
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm text-orange"><T k="nav.categories" /></p>
          <h1 className="mt-2 max-w-4xl text-5xl font-black leading-none text-white sm:text-6xl">
            <T k="categories.title" />
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
            <T k="categories.copy" />
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-2 lg:px-8">
        {categories.map((category) => {
          const products = getProductsByCategory(category.key);
          return (
            <CategoryCard key={category.key} category={category} products={products} />
          );
        })}
      </section>
    </>
  );
}
