import type { Metadata } from "next";

import Logo from "@/assets/svg/logo";
import { Faq } from "@/components/site/home/faq";
import { getSeo, seoToMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: "ar" | "en" }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const seo = await getSeo("faq", locale);

  return {
    ...seoToMetadata(seo),
    title: seo?.title || (locale === "ar" ? "الأسئلة الشائعة" : "Frequently asked questions"),
  };
}

export default async function FaqPage({ params }: PageProps) {
  const { locale } = await params;
  const isArabic = locale === "ar";

  return (
    <>
      <section className="relative overflow-hidden bg-brand-charcoal text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -end-24 -top-24 size-80 rounded-full border border-white/10 sm:size-[28rem]" />
        <div aria-hidden="true" className="pointer-events-none absolute -end-12 -top-12 size-56 rounded-full border border-white/10 sm:size-80" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-white/70">
            <Logo aria-hidden="true" className="size-5 text-primary" />
            {isArabic ? "نحن هنا لمساعدتك" : "Here to help"}
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-balance sm:text-6xl lg:text-7xl">
            {isArabic ? "الأسئلة الشائعة" : "Frequently asked questions"}
            <span className="text-primary">.</span>
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
            {isArabic
              ? "تعرّف على إجابات استفساراتك حول الإضاءة ومنتجاتنا، وتواصل معنا لو احتجت إلى مزيد من المساعدة."
              : "Find answers to your questions about lighting and our products, and get in touch if you need more help."}
          </p>
        </div>
      </section>
      <Faq params={params} />
    </>
  );
}
