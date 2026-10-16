// components/home/final-cta.tsx
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getPublicContents } from "@/lib/services/public-contents";

  type PageProps = {
    params: Promise<{ locale: "ar" | "en" }>;
  };
  
  
  export async function FinalCta({ params }: PageProps) {
  
    const { locale } = await params;
    const { data } = await getPublicContents("cta");
    const contents = data ?? [];
  
    const getContent = (section: string, key: string) => {
      return contents.find(
        (item) =>
          item.section === section &&
          item.key === key
      );
    };

    const button = locale == "ar" ? getContent("button", "title-ar")?.value : getContent("button", "title")?.value;
        const title = locale == "ar" ? getContent("content", "title-ar")?.value : getContent("content", "title")?.value;
        const desc = locale == "ar" ? getContent("content", "desc-ar")?.value : getContent("content", "desc")?.value;
  
  return (
    <section className="border-t border-white/10 bg-[hsl(var(--dark))] text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-20 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {title} {locale == "ar" ? <span className="text-primary">؟</span> : <span className="text-primary">?</span>}
          </h2>
          <p className="mt-3 max-w-xl text-sm text-white/60">
            {desc}
          </p>
        </div>
        <Link
          href="/products"
          className={`${buttonVariants({ size: "lg" })} shrink-0 bg-primary text-primary-foreground hover:bg-primary/90`}
        >
          {button}
        </Link>
      </div>
    </section>
  );
}