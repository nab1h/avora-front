"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Search, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCard } from "@/components/site/catalog/product-card";
import type { Category, Product } from "@/lib/catalog/types";

const PAGE_SIZE = 8;

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

export function ProductBrowser({
  products,
  categories,
  initialQuery = "",
  initialCategory = "all",
}: {
  products: Product[];
  categories: Category[];
  initialQuery?: string;
  initialCategory?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState<SortKey>("featured");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [category, sort, deferredQuery]);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    const list = products.filter(
      (product) =>
        (category === "all" || product.categorySlug === category) &&
        (!q ||
          product.name.toLowerCase().includes(q) ||
          (product.sku ?? "").toLowerCase().includes(q))
    );

    switch (sort) {
      case "price-asc":
        return [...list].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
      case "price-desc":
        return [...list].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
      case "name":
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return list;
    }
  }, [products, category, sort, deferredQuery]);

  const shown = filtered.slice(0, visible);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex h-auto flex-wrap gap-1" role="group" aria-label="Filter by category">
          {[{ slug: "all", name: "All" }, ...categories].map((item) => (
            <button
              key={item.slug}
              type="button"
              aria-pressed={category === item.slug}
              onClick={() => setCategory(item.slug)}
              className={`inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md px-3 text-sm font-medium transition-colors ${
                category === item.slug
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products…"
              className="pl-9 sm:w-64"
              aria-label="Search products"
            />
          </div>
          <Select value={sort} onValueChange={(value) => setSort(value as SortKey)}>
            <SelectTrigger className="sm:w-48" aria-label="Sort products">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: low to high</SelectItem>
              <SelectItem value="price-desc">Price: high to low</SelectItem>
              <SelectItem value="name">Name A–Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "product" : "products"}
      </p>

      {shown.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
          {shown.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              categories={categories}
              motionIndex={index}
            />
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-3 py-16 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-muted">
            <SearchX className="size-5 text-muted-foreground" aria-hidden="true" />
          </span>
          <p className="text-sm font-medium">No products match your search</p>
          <p className="text-sm text-muted-foreground">
            Try a different term or category.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
          >
            Clear filters
          </Button>
        </div>
      )}

      {visible < filtered.length && (
        <div className="mt-14 flex justify-center">
          <Button variant="outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
            Load more ({filtered.length - visible} remaining)
          </Button>
        </div>
      )}
    </div>
  );
}
