import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for DINGQI GROS.",
};

const sections = [
  {
    title: "Information we collect",
    text: "DINGQI GROS collects the information customers provide through reservation forms, cart checkout, and WhatsApp messages, including name, phone number, city, address, order notes, and selected products.",
  },
  {
    title: "How information is used",
    text: "Customer information is used to prepare quotes, confirm product availability, arrange delivery, answer support questions, and keep a record of order requests.",
  },
  {
    title: "Product and analytics data",
    text: "The product catalog is stored locally in data/products.json and contains DingQi product names, IDs, categories, images, specifications, and source URLs. The website can be connected to analytics after deployment if the store owner chooses to do so.",
  },
  {
    title: "Sharing and retention",
    text: "Customer details are not sold. Information may be shared only with service providers needed to fulfill orders, such as delivery partners or communication tools. Records are kept only as long as needed for business, legal, and customer service purposes.",
  },
  {
    title: "Customer rights",
    text: "Customers can request correction or deletion of their submitted information by contacting DINGQI GROS through the contact page or WhatsApp.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="text-sm text-orange">Legal</p>
      <h1 className="mt-2 font-serif text-6xl font-semibold leading-none text-foreground">
        Privacy Policy
      </h1>
      <p className="mt-5 text-muted">Last updated: May 16, 2026</p>

      <div className="mt-10 grid gap-5">
        {sections.map((section) => (
          <div key={section.title} className="glass-panel p-6">
            <h2 className="font-serif text-3xl font-semibold text-foreground">{section.title}</h2>
            <p className="mt-3 leading-8 text-muted">{section.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
