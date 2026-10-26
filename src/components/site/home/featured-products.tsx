
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { ProductCard } from "@/components/site/catalog/product-card";
import type { Category, Product } from "@/lib/catalog/types";

const PAGE_SIZE =9;

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
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(
    () =>
      activeCategory === "all"
        ? products
        : products.filter(
            (product) => product.categorySlug === activeCategory
          ),
    [products, activeCategory]
  );

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);

  const safePage = Math.min(currentPage, Math.max(totalPages, 1));

  const paginatedProducts = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, safePage]);

  function changeCategory(category: string) {
    setActiveCategory(category);
    setCurrentPage(1);
  }

  function changePage(page: number) {
    setCurrentPage(page);
  }

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
                {isArabic ? "عرض كل المنتجات" : "View all products"}
                <ArrowRight
                  className={`size-4 transition-transform duration-300 group-hover:translate-x-1 ${
                    isArabic ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </Link>
            }
          />
        </Reveal>

        <Tabs
          value={activeCategory}
          onValueChange={changeCategory}
        >
          <TabsList className="mx-auto h-auto max-w-full flex-wrap group-data-horizontal/tabs:h-auto">
            <TabsTrigger value="all">
              {isArabic ? "الكل" : "All"}
            </TabsTrigger>

            {categories.map((category) => (
              <TabsTrigger key={category.slug} value={category.slug}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent
            value={activeCategory}
            className="mt-10 animate-in fade-in-0 slide-in-from-bottom-1 duration-300"
          >
            <Grid
              products={paginatedProducts}
              categories={categories}
              isArabic={isArabic}
            />

            {totalPages > 1 && (
              <nav
                aria-label={isArabic ? "صفحات المنتجات" : "Product pagination"}
                className="mt-12 flex flex-wrap items-center justify-center gap-2"
                dir={isArabic ? "rtl" : "ltr"}
              >
                <button
                  type="button"
                  onClick={() => changePage(safePage - 1)}
                  disabled={safePage === 1}
                  className="inline-flex h-10 items-center gap-1 rounded-md border px-3 text-sm transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
                >
                  <ChevronLeft className="size-4" />
                  {isArabic ? "السابق" : "Previous"}
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - safePage) <= 1
                  )
                  .reduce<(number | "...")[]>((pages, page) => {
                    const previous = pages[pages.length - 1];

                    if (
                      typeof previous === "number" &&
                      page - previous > 1
                    ) {
                      pages.push("...");
                    }

                    pages.push(page);
                    return pages;
                  }, [])
                  .map((page, index) =>
                    page === "..." ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-1 text-muted-foreground"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={page}
                        type="button"
                        onClick={() => changePage(page)}
                        aria-current={page === safePage ? "page" : undefined}
                        className={`h-10 min-w-10 rounded-md border px-3 text-sm transition-colors ${
                          page === safePage
                            ? "border-primary bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                <button
                  type="button"
                  onClick={() => changePage(safePage + 1)}
                  disabled={safePage === totalPages}
                  className="inline-flex h-10 items-center gap-1 rounded-md border px-3 text-sm transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
                >
                  {isArabic ? "التالي" : "Next"}
                  <ChevronRight className="size-4" />
                </button>
              </nav>
            )}

            <p
              className="mt-4 text-center text-sm text-muted-foreground"
              aria-live="polite"
            >
              {isArabic
                ? `عرض ${
                    filteredProducts.length === 0
                      ? 0
                      : (safePage - 1) * PAGE_SIZE + 1
                  }–${Math.min(
                    safePage * PAGE_SIZE,
                    filteredProducts.length
                  )} من ${filteredProducts.length} منتج`
                : `Showing ${
                    filteredProducts.length === 0
                      ? 0
                      : (safePage - 1) * PAGE_SIZE + 1
                  }–${Math.min(
                    safePage * PAGE_SIZE,
                    filteredProducts.length
                  )} of ${filteredProducts.length} products`}
            </p>
          </TabsContent>
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
