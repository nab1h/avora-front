"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { ProductCard } from "@/components/site/catalog/product-card";
import type { Category, Product } from "@/lib/catalog/types";

export function FeaturedProducts({
  products,
  categories,
  title = "Selected products",
  description = "A cross-section of the catalog — fixtures, outdoor solutions, and electrical essentials.",
  eyebrow = "Featured",
  isArabic,
}: {
  products: Product[];
  categories: Category[];
  title?: string;
  description?: string;
  eyebrow?: string;
  isArabic: boolean;
}) {
  return (
    <section className="border-t bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <Reveal>
        <SectionHeading
          index="02"
          eyebrow={eyebrow}
          title={title}
          description={description}
          action={
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
            >
              View all products
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180"
                aria-hidden="true"
              />
            </Link>
          }
        />
        </Reveal>

        <Tabs defaultValue="all">
          <TabsList className="mx-auto h-auto max-w-full flex-wrap group-data-horizontal/tabs:h-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category.slug} value={category.slug}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-10 animate-in fade-in-0 slide-in-from-bottom-1 duration-300">
            <Grid products={products} categories={categories} isArabic={isArabic} />
          </TabsContent>

          {categories.map((category) => (
            <TabsContent
              key={category.slug}
              value={category.slug}
              className="mt-10 animate-in fade-in-0 slide-in-from-bottom-1 duration-300"
            >
              <Grid
                products={products.filter((p) => p.categorySlug === category.slug)}
                categories={categories}
                isArabic={isArabic}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

function Grid({
  products,
  categories,
  isArabic,
}: {
  products: Product[];
  categories: Category[];
  isArabic: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          categories={categories}
          motionIndex={index}
          isArabic={isArabic}
        />
      ))}
    </div>
  );
}
