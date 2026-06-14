import type { Metadata } from "next";
import {
  ArrowRight,
  Clock,
  CreditCard,
  Headphones,
  MessageCircle,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import { CategoryCard } from "@/components/category-card";
import { Hero } from "@/components/hero";
import { MotionSection } from "@/components/motion-section";
import { TopWinningProducts } from "@/components/top-winning-products";
import { LocalizedLink, T } from "@/lib/i18n";
import { getCategories } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "DINGQI GROS Maroc | أدوات DINGQI الأصلية",
  description: "متجر DINGQI بالمغرب للبيع بالجملة والتقسيط: أدوات ومعدات صناعية أصلية، عروض أسعار سريعة، وتوصيل مجاني لجميع المدن المغربية.",
  path: "/",
});

const trustHighlights = [
  {
    icon: Truck,
    title: "trust.delivery.title",
    text: "trust.delivery.text",
  },
  {
    icon: ShieldCheck,
    title: "trust.warranty.title",
    text: "trust.warranty.text",
  },
  {
    icon: CreditCard,
    title: "trust.payment.title",
    text: "trust.payment.text",
  },
  {
    icon: Clock,
    title: "trust.hours.title",
    text: "trust.hours.text",
  },
  {
    icon: Headphones,
    title: "trust.whatsapp.title",
    text: "trust.whatsapp.text",
  },
  {
    icon: Star,
    title: "trust.satisfaction.title",
    text: "trust.satisfaction.text",
  },
] as const;

export default function Home() {
  const categories = getCategories();

  return (
    <>
      <Hero />

      <TopWinningProducts />

      <MotionSection className="premium-shell border-y border-white/10">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm text-orange"><T k="nav.categories" /></p>
            <h2 className="mt-2 text-5xl font-black text-white">
              <T k="home.categoriesTitle" />
            </h2>
            <p className="mt-5 leading-8 text-white/68">
              <T k="home.categoriesCopy" />
            </p>
            <LocalizedLink href="/categories" className="btn-primary magnetic mt-8" data-cursor="cta">
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

      <MotionSection className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <p className="text-sm font-bold text-orange"><T k="trust.eyebrow" /></p>
            <h2 className="mt-3 max-w-3xl text-4xl font-black leading-tight text-foreground sm:text-5xl">
              <T k="trust.title" />
            </h2>
            <LocalizedLink href="/contact" className="btn-whatsapp magnetic mt-8" data-cursor="cta">
              <MessageCircle size={18} />
              <T k="hero.whatsapp" />
            </LocalizedLink>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {trustHighlights.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="glass-card p-5 sm:p-6">
                  <div className="grid h-12 w-12 place-items-center rounded-full border border-orange/30 bg-orange/10 text-orange">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-5 text-xl font-black text-foreground">
                    <T k={item.title} />
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    <T k={item.text} />
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </MotionSection>
    </>
  );
}
