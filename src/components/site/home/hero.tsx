import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { TypingText } from "@/components/shared/typing-text";
import { getLocale, getTranslations } from "next-intl/server";
import { getCategories } from "@/lib/catalog/data";
import { siteImages } from "@/lib/site/images";

const enter = (delay: number) => ({
  style: { animationDelay: `${delay}ms` },
});

export async function Hero({title, subtitle,proButton,cateButton}: {title?: string, subtitle?: string, proButton?: string, cateButton?: string}) {
  const categories = getCategories();
  const [locale, t] = await Promise.all([getLocale(), getTranslations("heroMotion")]);
  const phrases = [t("phrase1"), t("phrase2"), t("phrase3"), t("phrase4")];

  return (
    <section className="hero-motion relative min-h-[92svh] overflow-hidden bg-[hsl(var(--dark))] text-white">
      <Image
        src={siteImages.hero}
        alt=""
        fill
        priority
        sizes="100vw"
        className="hero-image object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--dark))]/95 via-[hsl(var(--dark))]/55 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[hsl(var(--dark))] to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[92svh] max-w-7xl flex-col justify-end px-4 pb-12 pt-32 sm:px-6 lg:px-8">
        <p
          {...enter(0)}
          className="hero-enter flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-white/60"
        >
          <span aria-hidden="true" className="block size-2 bg-primary" />
          {t("eyebrow")}
        </p>

        <h1
          {...enter(120)}
          className="hero-enter mt-6 max-w-4xl text-5xl font-semibold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl"
        >
          {title ?? "Designing and building"}
          <span className="mt-2 block text-primary">
            <TypingText phrases={phrases} locale={locale} />
          </span>
        </h1>

        <p
          {...enter(240)}
          className="hero-enter mt-6 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base"
        >
          {subtitle ?? "We are a team of designers and developers that create beautiful, functional, and user-friendly websites."}
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <div {...enter(340)} className="hero-enter">
            <Link href="/products" className={buttonVariants({ size: "lg", className: "site-cta bg-primary text-primary-foreground hover:bg-primary/90" })}>{proButton ?? "Explore Products"}</Link>
          </div>
          <div {...enter(420)} className="hero-enter">
          <Link
            href="/#categories"
            className={buttonVariants({ size: "lg", variant: "outline", className: "site-cta border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white" })}
          >
            {cateButton ?? "Discover Our Collection"}
          </Link>
          </div>
        </div>

        {/* Editorial category index — replaces a row of cards */}
        <div
          {...enter(520)}
          className="hero-enter mt-14 flex flex-wrap gap-x-12 gap-y-4 border-t border-white/15 pt-6"
        >
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              href={`/products?category=${category.slug}`}
              className="group flex items-baseline gap-3"
            >
              <span className="text-[11px] tracking-[0.2em] text-primary">
                0{index + 1}
              </span>
              <span className="text-sm text-white/70 transition-colors group-hover:text-white">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
