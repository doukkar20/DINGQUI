import type { Metadata } from "next";
import { Boxes, Clock, Mail, MapPin, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { contactEmail, contactEmailHref } from "@/lib/contact";
import { T } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { buildWhatsAppUrl, displayPhoneNumber } from "@/lib/whatsapp";

export const metadata: Metadata = pageMetadata({
  title: "Contact DINGQI GROS",
  description: "Contact DINGQI GROS by WhatsApp or email for DingQi tools, price requests, delivery, and professional orders in Morocco.",
  path: "/contact",
});

export default function ContactPage() {
  const whatsappHref = buildWhatsAppUrl(
    "السلام عليكم، أود الاستفسار عن منتجات DINGQI GROS.",
  );

  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
      <div>
        <p className="text-sm text-orange"><T k="nav.contact" /></p>
        <h1 className="mt-2 font-serif text-6xl font-semibold leading-none text-foreground">
          <T k="contact.title" />
        </h1>
        <p className="mt-3 text-2xl font-semibold text-deep-orange">{displayPhoneNumber}</p>
        <p className="mt-6 text-lg leading-8 text-muted">
          <T k="contact.copy" />
        </p>

        <div className="mt-8 grid gap-4">
          <a href={whatsappHref} target="_blank" rel="noreferrer" className="glass-card flex items-center gap-4 p-5">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-orange/10 text-orange">
              <MessageCircle size={21} />
            </span>
            <span>
              <span className="block font-semibold text-foreground"><T k="actions.orderWhatsapp" /></span>
              <span className="block text-sm text-muted"><T k="actions.requestQuote" /></span>
            </span>
          </a>
          <div className="glass-card flex items-center gap-4 p-5">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-orange/10 text-orange">
              <Clock size={21} />
            </span>
            <span>
              <span className="block font-semibold text-foreground"><T k="actions.requestQuote" /></span>
              <span className="block text-sm text-muted"><T k="checkout.finalPricing" /></span>
            </span>
          </div>
          <a href={contactEmailHref} className="glass-card flex items-center gap-4 p-5">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-orange/10 text-orange">
              <Mail size={21} />
            </span>
            <span>
              <span className="block font-semibold text-foreground"><T k="contact.email" /></span>
              <span className="block text-sm text-muted">{contactEmail}</span>
            </span>
          </a>
          <div className="glass-card flex items-center gap-4 p-5">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-orange/10 text-orange">
              <Boxes size={21} />
            </span>
            <span>
              <span className="block font-semibold text-foreground"><T k="badges.genuine" /></span>
              <span className="block text-sm text-muted"><T k="form.notesPlaceholder" /></span>
            </span>
          </div>
          <div className="glass-card flex items-center gap-4 p-5">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-orange/10 text-orange">
              <MapPin size={21} />
            </span>
            <span>
              <span className="block font-semibold text-foreground"><T k="badges.nationwide" /></span>
              <span className="block text-sm text-muted"><T k="badges.delivery" /></span>
            </span>
          </div>
        </div>
      </div>

      <ContactForm />
    </section>
  );
}
