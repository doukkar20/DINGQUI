import type { Metadata } from "next";
import { CategoryCard } from "@/components/category-card";
import { T } from "@/lib/i18n";
import { getCategories, getProductsByCategory } from "@/lib/products";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse DINGQI GROS product categories imported from DingQi.",
};

export default function CategoriesPage() {
  const categories = getCategories();

  return (
    <>
      <section className="border-b border-gray-200 bg-light-gray">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-sm text-orange"><T k="nav.categories" /></p>
          <h1 className="mt-2 max-w-4xl font-serif text-6xl font-semibold leading-none text-foreground">
            <T k="categories.title" />
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
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
