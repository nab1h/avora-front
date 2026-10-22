import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import type { Category } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

/** Unequal editorial grid — each category gets its own footprint. */
const layouts = [
  "md:col-span-7 aspect-[4/3]",
  "md:col-span-5 md:mt-24 aspect-[4/3]",
  "md:col-span-8 md:col-start-3 aspect-[16/9]",
];

export function CategoryShowcase({ categories ,categoryShowcaseTitleValue, categoryShowcaseDescription }: { categories: Category[]; categoryShowcaseTitleValue?: string; categoryShowcaseDescription?: string }) {
  return (
    <section id="categories" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeading
          index="01"
          eyebrow="Collections"
          title={categoryShowcaseTitleValue ?? "Collections"}
          description={categoryShowcaseDescription}
        />
      </Reveal>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
        {categories.map((category, index) => (
          <Reveal key={category.slug} image delay={Math.min(index, 3) * 80} className={cn(layouts[index])}>
            <Link
              href={`/products?category=${category.slug}`}
              className="category-motion group relative block h-full w-full overflow-hidden rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(min-width: 768px) 58vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="category-overlay absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <span className="absolute right-5 top-5 text-xs font-medium tracking-[0.25em] text-white/70">
                0{index + 1}
              </span>
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                <p className="mt-1 max-w-md text-sm text-white/70">
                  {category.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary">
                  Explore
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
