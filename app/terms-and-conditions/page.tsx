import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and conditions for DINGQI GROS.",
};

const sections = [
  {
    title: "Quote-based ordering",
    text: "DINGQI GROS displays products for reservation and quote requests. Prices are intentionally empty unless a store administrator edits them manually. A submitted cart or checkout message is a request, not an automatic purchase contract.",
  },
  {
    title: "Product information",
    text: "Product names, categories, images, descriptions, product IDs, and specifications are imported from the listed DingQi source URLs. DINGQI GROS aims to keep this information accurate but may update or correct catalog data when source information changes.",
  },
  {
    title: "Availability and confirmation",
    text: "Availability, delivery timing, final pricing, and order acceptance are confirmed manually after the customer submits a quote request through WhatsApp or the checkout form.",
  },
  {
    title: "Customer responsibilities",
    text: "Customers are responsible for providing accurate contact details, delivery information, quantities, and model requirements. Incorrect information may delay quote preparation or delivery.",
  },
  {
    title: "Returns and support",
    text: "Return, exchange, warranty, and support terms should be confirmed during the quote process because professional tools may be subject to supplier conditions, usage requirements, and product-specific policies.",
  },
];

export default function TermsAndConditionsPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="text-sm text-gold">Legal</p>
      <h1 className="mt-2 font-serif text-6xl font-semibold leading-none text-white">
        Terms and Conditions
      </h1>
      <p className="mt-5 text-muted">Last updated: May 16, 2026</p>

      <div className="mt-10 grid gap-5">
        {sections.map((section) => (
          <div key={section.title} className="glass-panel p-6">
            <h2 className="font-serif text-3xl font-semibold text-white">{section.title}</h2>
            <p className="mt-3 leading-8 text-muted">{section.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
