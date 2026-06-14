import type { Metadata } from "next";
import { BadgeCheck, Gem, Shield, Wrench } from "lucide-react";
import { MotionSection } from "@/components/motion-section";
import { StaggerGrid } from "@/components/stagger-grid";
import { T } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "عن DINGQI GROS | أدوات DINGQI بالمغرب",
  description: "تعرف على DINGQI GROS، متجر أدوات DINGQI الأصلية بالمغرب لخدمة المهنيين والمحلات مع عروض أسعار ودعم وتوصيل لجميع المدن.",
  path: "/about",
});

const values = [
  {
    icon: Gem,
    title: "about.value.presentation.title",
    text: "about.value.presentation.text",
  },
  {
    icon: BadgeCheck,
    title: "about.value.catalog.title",
    text: "about.value.catalog.text",
  },
  {
    icon: Wrench,
    title: "about.value.trade.title",
    text: "about.value.trade.text",
  },
  {
    icon: Shield,
    title: "about.value.pricing.title",
    text: "about.value.pricing.text",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-gray-200 bg-light-gray">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm text-orange"><T k="about.eyebrow" /></p>
          <h1 className="mt-2 max-w-4xl font-serif text-6xl font-semibold leading-none text-foreground">
            <T k="about.heroTitle" />
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            <T k="about.heroCopy" />
          </p>
        </div>
      </section>

      <MotionSection className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <StaggerGrid className="grid gap-6 md:grid-cols-2 lg:grid-cols-4" itemClassName="h-full">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <div key={value.title} className="glass-panel h-full p-6">
                <div className="grid h-12 w-12 place-items-center rounded-full border border-orange/40 bg-orange/10 text-orange">
                  <Icon size={22} />
                </div>
                <h2 className="mt-5 font-serif text-2xl font-semibold text-foreground">
                  <T k={value.title} />
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted">
                  <T k={value.text} />
                </p>
              </div>
            );
          })}
        </StaggerGrid>
      </MotionSection>

      <MotionSection className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="glass-panel grid gap-8 p-8 lg:grid-cols-[0.8fr_1.2fr] lg:p-10">
          <div>
            <p className="text-sm text-orange"><T k="about.model.eyebrow" /></p>
            <h2 className="mt-2 font-serif text-5xl font-semibold text-foreground">
              <T k="about.model.title" />
            </h2>
          </div>
          <div className="grid gap-5 text-sm leading-7 text-muted">
            <p><T k="about.model.p1" /></p>
            <p><T k="about.model.p2" /></p>
          </div>
        </div>
      </MotionSection>
    </>
  );
}
