import type { Metadata } from "next";
import { T } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "Privacy policy for DINGQI GROS customer requests, WhatsApp orders, catalog data, and contact information.",
  path: "/privacy-policy",
});

const sections = [
  ["privacy.info.title", "privacy.info.text"],
  ["privacy.use.title", "privacy.use.text"],
  ["privacy.catalog.title", "privacy.catalog.text"],
  ["privacy.sharing.title", "privacy.sharing.text"],
  ["privacy.rights.title", "privacy.rights.text"],
] as const;

export default function PrivacyPolicyPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="text-sm text-orange"><T k="legal.eyebrow" /></p>
      <h1 className="mt-2 font-serif text-6xl font-semibold leading-none text-foreground">
        <T k="privacy.title" />
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
