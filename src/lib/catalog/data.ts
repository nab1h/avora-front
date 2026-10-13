import type { Category, Product } from "@/lib/catalog/types";
import { productImage, siteImages } from "@/lib/site/images";

/**
 * ⚠️ PLACEHOLDER CATALOG — TEMPORARY
 * ----------------------------------
 * Demo data so the storefront renders end-to-end. Do NOT ship to
 * production. Replace with your existing RTK Query hooks:
 *
 *   const { data: products, isLoading } = useGetProductsQuery();
 *   const { data: categories } = useGetCategoriesQuery();
 *
 * Every UI component below is props-driven and data-source agnostic,
 * so the swap touches only the pages, not the components.
 */
export const placeholderCategories: Category[] = [
  {
    id: "cat-1",
    slug: "category-01",
    name: "Category 01",
    description: "Placeholder description — replace with the real category name and copy.",
    image: siteImages.categories[0],
  },
  {
    id: "cat-2",
    slug: "category-02",
    name: "Category 02",
    description: "Placeholder description — replace with the real category name and copy.",
    image: siteImages.categories[1],
  },
  {
    id: "cat-3",
    slug: "category-03",
    name: "Category 03",
    description: "Placeholder description — replace with the real category name and copy.",
    image: siteImages.categories[2],
  },
];

const product = (
  index: number,
  slug: string,
  name: string,
  categorySlug: string,
  price: number,
  extra: Partial<Product> = {}
): Product => ({
  id: `prod-${index}`,
  slug,
  name,
  categorySlug,
  description:
    "Placeholder product description. Replace with the real description from your catalog API.",
  images: [productImage(index), productImage(index + 1)],
  price,
  sku: `SKU-00${index}`,
  inStock: index % 4 !== 0,
  specs: [
    { label: "Wattage", value: `${6 + index * 2} W` },
    { label: "Color temperature", value: index % 2 ? "4000 K" : "3000 K" },
    { label: "IP rating", value: index % 3 === 0 ? "IP65" : "IP20" },
  ],
  ...extra,
});

export const placeholderProducts: Product[] = [
  product(1, "pendant-200", "Pendant 200 — Cylinder", "category-01", 129),
  product(2, "downlight-9w", "Recessed Downlight 9 W", "category-01", 34),
  product(3, "panel-600", "Surface Panel 600×600", "category-01", 58),
  product(4, "bollard-8w", "Garden Bollard 8 W", "category-02", 96),
  product(5, "wall-washer-40", "Wall Washer Linear 40 W", "category-02", 145),
  product(6, "strip-24v", "LED Strip 24 V — Warm", "category-02", 42),
  product(7, "filament-a60", "Filament Bulb A60 6 W", "category-03", 9),
  product(8, "track-spot-12", "Track Spotlight 12 W", "category-03", 61),
];

export function getCategories(): Category[] {
  return placeholderCategories;
}

export function getAllProducts(): Product[] {
  return placeholderProducts;
}

export function getProductBySlug(slug: string): Product | undefined {
  return placeholderProducts.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return placeholderProducts
    .filter((p) => p.categorySlug === product.categorySlug && p.slug !== product.slug)
    .slice(0, limit);
}

export function getCategoryName(slug: string, categories: Category[]): string {
  return categories.find((c) => c.slug === slug)?.name ?? slug;
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD", // TODO: from siteConfig.currency once real
    minimumFractionDigits: 0,
  }).format(value);
}