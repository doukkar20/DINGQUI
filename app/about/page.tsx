import type { Metadata } from "next";
import { BadgeCheck, Gem, Shield, Wrench } from "lucide-react";
import { MotionSection } from "@/components/motion-section";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about DINGQI GROS, a DingQi tools ordering and reservation storefront in Morocco.",
};

const values = [
  {
    icon: Gem,
    title: "Premium presentation",
    text: "A black and gold brand system gives professional tools the confidence of a high-end industrial showroom.",
  },
  {
    icon: BadgeCheck,
    title: "Traceable catalog",
    text: "Each imported product keeps its product ID, specifications, images, category, and DingQi source URL.",
  },
  {
    icon: Wrench,
    title: "Trade ready",
    text: "Search, filters, product details, quantity controls, cart, and checkout are tuned for practical sourcing.",
  },
  {
    icon: Shield,
    title: "Manual pricing",
    text: "No prices are invented. Pricing fields stay empty until a store administrator edits the JSON catalog.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm text-gold">About DINGQI GROS</p>
          <h1 className="mt-2 max-w-4xl font-serif text-6xl font-semibold leading-none text-white">
            DingQi tools with clean WhatsApp ordering
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            DINGQI GROS is designed as a black and gold ordering experience for DingQi tool
            customers in Morocco. The catalog is powered by locally stored product data, with a
            reservation form that sends complete customer and product details directly to WhatsApp.
          </p>
        </div>
      </section>

      <MotionSection className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {values.map((value) => {
          const Icon = value.icon;
          return (
            <div key={value.title} className="glass-panel p-6">
              <div className="grid h-12 w-12 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold">
                <Icon size={22} />
              </div>
              <h2 className="mt-5 font-serif text-2xl font-semibold text-white">{value.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted">{value.text}</p>
            </div>
          );
        })}
      </MotionSection>

      <MotionSection className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="glass-panel grid gap-8 p-8 lg:grid-cols-[0.8fr_1.2fr] lg:p-10">
          <div>
            <p className="text-sm text-gold">Operating model</p>
            <h2 className="mt-2 font-serif text-5xl font-semibold text-white">
              A storefront built around clear reservations before confirmation
            </h2>
          </div>
          <div className="grid gap-5 text-sm leading-7 text-muted">
            <p>
              The importer reads URLs from urls.txt, extracts the visible product data, downloads
              product images locally, and writes a clean JSON catalog. The frontend then renders
              the same source-backed data across home, shop, categories, details, cart, and
              checkout.
            </p>
            <p>
              Customers send their name, phone, city, address, product, quantity, and notes to
              WhatsApp. Final pricing and availability are confirmed manually by DINGQI GROS.
            </p>
          </div>
        </div>
      </MotionSection>
    </>
  );
}
