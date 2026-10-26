import Link from "next/link";
import Logo from "@/assets/svg/logo";
import { getPolicy, policies } from "@/lib/policies";
import { getPublicSettings } from "@/lib/services/public-settings";

export type PolicyPageProps = { params: Promise<{ locale: string }> };

export async function PolicyPage({ locale, slug }: { locale: string; slug: string }) {
  const isArabic = locale === "ar";
  const policy = getPolicy(slug, locale);
  const settings = await getPublicSettings();
  const siteName = settings?.data.general?.site_name || "AVORA";

  return (
    <main>
      <section className="relative overflow-hidden bg-brand-charcoal text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -end-24 -top-24 size-80 rounded-full border border-white/10 sm:size-[28rem]" />
        <div aria-hidden="true" className="pointer-events-none absolute -end-12 -top-12 size-56 rounded-full border border-white/10 sm:size-80" />
        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-widest text-white/70">
            <Logo aria-hidden="true" className="size-5 text-primary" />
            {siteName} / {isArabic ? "السياسات" : "Our policies"}
          </p>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-balance sm:text-6xl lg:text-7xl">
            {policy.title}<span className="text-primary">.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/70">{policy.description}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl items-start gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[17rem_1fr] lg:gap-20">
        <aside className="space-y-8 lg:sticky lg:top-28">
          <nav aria-label={isArabic ? "محتويات الصفحة" : "On this page"} className="border-s-2 border-primary ps-5">
            <h2 className="font-semibold">{isArabic ? "في هذه الصفحة" : "On this page"}</h2>
            <ol className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              {policy.sections.map((section, index) => (
                <li key={section.title}><a href={`#section-${index + 1}`} className="transition-colors hover:text-foreground">{section.title}</a></li>
              ))}
            </ol>
          </nav>
          <nav aria-label={isArabic ? "السياسات الأخرى" : "Other policies"} className="border bg-muted/40 p-5">
            <h2 className="font-semibold">{isArabic ? "سياساتنا" : "Our policies"}</h2>
            <div className="mt-4 space-y-3 text-sm leading-6">
              {Object.keys(policies).map((key) => (
                <Link key={key} href={`/${locale}/${key}`} aria-current={key === slug ? "page" : undefined} className={`block transition-colors hover:text-foreground ${key === slug ? "font-semibold text-foreground underline decoration-primary underline-offset-4" : "text-muted-foreground"}`}>
                  {getPolicy(key, locale).title}
                </Link>
              ))}
            </div>
          </nav>
        </aside>

        <div className="min-w-0">
          <div className="divide-y">
            {policy.sections.map((section, index) => (
              <section key={section.title} id={`section-${index + 1}`} aria-labelledby={`heading-${index + 1}`} className="scroll-mt-32 py-8 first:pt-0 sm:py-10">
                <p aria-hidden="true" className="mb-3 text-xs font-medium tracking-widest text-muted-foreground">{String(index + 1).padStart(2, "0")}</p>
                <h2 id={`heading-${index + 1}`} className="text-xl font-semibold sm:text-2xl">{section.title}</h2>
                <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">{section.body}</p>
              </section>
            ))}
          </div>
          <div className="mt-6 border bg-muted/40 p-6 sm:p-8">
            <h2 className="text-xl font-semibold">{isArabic ? "هل لديك استفسار؟" : "Have a question?"}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{isArabic ? "فريقنا متاح لتوضيح السياسات والإجابة عن أسئلتك حول طلبك." : "Our team can explain these policies and answer questions about your order."}</p>
            <Link href={`/${locale}/contact`} className="mt-5 inline-flex min-h-11 items-center bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">{isArabic ? "تواصل معنا" : "Contact us"}</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
