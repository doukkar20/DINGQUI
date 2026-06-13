import type { Metadata } from "next";
import { T } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms and Conditions",
  description: "Terms and conditions for DINGQI GROS DingQi tool quote requests, availability, delivery, returns, and support.",
  path: "/terms-and-conditions",
});

const sections = [
  ["terms.quote.title", "terms.quote.text"],
  ["terms.product.title", "terms.product.text"],
  ["terms.confirm.title", "terms.confirm.text"],
  ["terms.customer.title", "terms.customer.text"],
  ["terms.support.title", "terms.support.text"],
] as const;

export default function TermsAndConditionsPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="text-sm text-orange"><T k="legal.eyebrow" /></p>
      <h1 className="mt-2 font-serif text-6xl font-semibold leading-none text-foreground">
        <T k="terms.title" />
      </h1>
      <p className="mt-5 text-muted"><T k="legal.updated" /></p>

      <div className="mt-10 grid gap-5">
        {sections.map(([title, text]) => (
          <div key={title} className="glass-panel p-6">
            <h2 className="font-serif text-3xl font-semibold text-foreground"><T k={title} /></h2>
            <p className="mt-3 leading-8 text-muted"><T k={text} /></p>
          </div>
        ))}
      </div>
    </section>
  );
}
