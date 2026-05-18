import { ArrowRight, BadgeCheck, Database, MessageCircle, ShieldCheck } from "lucide-react";
import { CategoryCard } from "@/components/category-card";
import { Hero } from "@/components/hero";
import { MotionSection } from "@/components/motion-section";
import { ProductCard } from "@/components/product-card";
import { LocalizedLink, T } from "@/lib/i18n";
import { getCategories, getFeaturedProducts, getProducts } from "@/lib/products";

const commitments = [
  {
    icon: BadgeCheck,
    title: "commitments.source.title",
    text: "commitments.source.text",
  },
  {
    icon: Database,
    title: "commitments.catalog.title",
    text: "commitments.catalog.text",
  },
  {
    icon: ShieldCheck,
    title: "commitments.quote.title",
    text: "commitments.quote.text",
  },
  {
    icon: MessageCircle,
    title: "commitments.whatsapp.title",
    text: "commitments.whatsapp.text",
  },
];

export default function Home() {
  const products = getProducts();
  const featured = getFeaturedProducts(5);
  const categories = getCategories();

  return (
    <>
      <Hero products={featured} />

      <MotionSection className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:px-8">
        {[
          ["home.stats.products", products.length.toString()],
          ["home.stats.categories", categories.length.toString()],
          ["home.stats.assets", products.reduce((total, product) => total + product.images.length, 0).toString()],
        ].map(([label, value]) => (
          <div key={label} className="glass-panel p-6">
            <p className="text-sm text-muted"><T k={label as "home.stats.products"} /></p>
            <p className="mt-2 font-serif text-5xl font-semibold text-foreground">{value}</p>
          </div>
        ))}
      </MotionSection>

      <MotionSection className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm text-orange"><T k="home.featuredEyebrow" /></p>
            <h2 className="mt-2 font-serif text-5xl font-semibold text-foreground">
              <T k="home.featuredTitle" />
            </h2>
          </div>
          <LocalizedLink href="/shop" className="btn-ghost self-start">
            <T k="home.viewAll" />
            <ArrowRight size={18} />
          </LocalizedLink>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.slice(0, 4).map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </MotionSection>

      <MotionSection className="border-y border-gray-200 bg-light-gray">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm text-orange"><T k="nav.categories" /></p>
            <h2 className="mt-2 font-serif text-5xl font-semibold text-foreground">
              <T k="home.categoriesTitle" />
            </h2>
            <p className="mt-5 leading-8 text-muted">
              <T k="home.categoriesCopy" />
            </p>
            <LocalizedLink href="/categories" className="btn-primary mt-8">
            <T k="home.browseCategories" />
              <ArrowRight size={18} />
            </LocalizedLink>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {categories.map((category) => (
              <CategoryCard key={category.key} category={category} compact />
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {commitments.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="glass-panel p-6">
                <div className="grid h-12 w-12 place-items-center rounded-full border border-orange/40 bg-orange/10 text-orange">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 font-serif text-2xl font-semibold text-foreground"><T k={item.title as "commitments.source.title"} /></h3>
                <p className="mt-3 text-sm leading-7 text-muted"><T k={item.text as "commitments.source.text"} /></p>
              </div>
            );
          })}
        </div>
      </MotionSection>
    </>
  );
}
