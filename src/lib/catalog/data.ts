import { cache } from "react";

import { getPublicAssetUrl } from "@/lib/services/public-assets";
import { productImage, siteImages } from "@/lib/site/images";

import type { Category, Product } from "./types";

type PublicCategory = {
  id: number;
  name_ar: string;
  name_en: string;
  slug: string;
  description_ar: string | null;
  description_en: string | null;
  status: "active" | "inactive";
  sort_order: number;
  gallery_item?: {
    image: string | null;
  } | null;
};

type PublicProduct = {
  id: number;
  category_id: number;
  name_ar: string;
  name_en: string;
  slug: string;
  sku: string | null;
  description_ar: string | null;
  description_en: string | null;
  price: string;
  sale_price: string | null;
  status: "active" | "inactive";
  is_featured: boolean;
  sort_order: number;
  category?: {
    slug: string;
  } | null;
  images?: {
    image_path: string;
    url: string;
    sort_order: number;
  }[] | null;
  specifications?: {
    value_ar: string | null;
    value_en: string | null;
    sort_order: number;
    specification?: {
      spec_key: string;
      name_ar: string;
      name_en: string;
    } | null;
  }[] | null;
};

type PaginatedResponse<T> = {
  data: T[];
  meta?: {
    last_page?: number;
  };
};

async function fetchPublicPages<T>(endpoint: "categories" | "products"): Promise<T[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is required to load the public catalog.");
  }

  async function fetchPage(page: number): Promise<PaginatedResponse<T>> {
    const response = await fetch(`${apiUrl}/${endpoint}?page=${page}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch public ${endpoint} (HTTP ${response.status}).`,
      );
    }

    const result: unknown = await response.json();
    if (
      !result ||
      typeof result !== "object" ||
      !("data" in result) ||
      !Array.isArray(result.data)
    ) {
      throw new Error(`The public ${endpoint} response has an invalid shape.`);
    }

    return result as PaginatedResponse<T>;
  }

  const firstPage = await fetchPage(1);
  const lastPage = Math.max(1, firstPage.meta?.last_page ?? 1);
  const remainingPages = await Promise.all(
    Array.from({ length: lastPage - 1 }, (_, index) =>
      fetchPage(index + 2),
    ),
  );

  return [firstPage, ...remainingPages].flatMap((page) => page.data);
}

const getPublicCategories = cache(() => fetchPublicPages<PublicCategory>("categories"));
const getPublicProducts = cache(() => fetchPublicPages<PublicProduct>("products"));

export async function getCategories(locale: string): Promise<Category[]> {
  const categories = await getPublicCategories();

  return categories
    .filter((category) => category.status === "active")
    .sort((first, second) => first.sort_order - second.sort_order)
    .map((category, index) => ({
      id: String(category.id),
      slug: category.slug,
      name: locale.startsWith("ar") ? category.name_ar : category.name_en,
      description:
        (locale.startsWith("ar")
          ? category.description_ar
          : category.description_en) ?? "",
      image:
        getPublicAssetUrl(category.gallery_item?.image) ??
        siteImages.categories[index % siteImages.categories.length],
    }));
}

export async function getAllProducts(locale: string): Promise<Product[]> {
  const [products, categories] = await Promise.all([
    getPublicProducts(),
    getCategories(locale),
  ]);
  const categoriesById = new Map(
    categories.map((category) => [category.id, category]),
  );

  return products
    .filter((product) => product.status === "active")
    .sort((first, second) => first.sort_order - second.sort_order)
    .map((product, index) => {
      const category =
        product.category ?? categoriesById.get(String(product.category_id));
      const images = (product.images ?? [])
        .slice()
        .sort((first, second) => first.sort_order - second.sort_order)
        .map((image) => getPublicAssetUrl(image.url || image.image_path))
        .filter((image): image is string => image !== null);

      const specs = (product.specifications ?? [])
        .slice()
        .sort((first, second) => first.sort_order - second.sort_order)
        .flatMap((specification) => {
          const label = locale.startsWith("ar")
            ? specification.specification?.name_ar
            : specification.specification?.name_en;
          const value = locale.startsWith("ar")
            ? specification.value_ar
            : specification.value_en;

          return label && value ? [{ label, value }] : [];
        });

      const price = Number(product.sale_price ?? product.price);

      return {
        id: String(product.id),
        slug: product.slug,
        name: locale.startsWith("ar") ? product.name_ar : product.name_en,
        categorySlug: category?.slug ?? "",
        description:
          (locale.startsWith("ar")
            ? product.description_ar
            : product.description_en) ?? "",
        images: images.length > 0 ? images : [productImage(index)],
        ...(Number.isFinite(price) ? { price } : {}),
        ...(product.sku ? { sku: product.sku } : {}),
        ...(specs.length > 0 ? { specs } : {}),
      };
    });
}

export async function getProductBySlug(
  slug: string,
  locale: string,
): Promise<Product | undefined> {
  const products = await getAllProducts(locale);
  return products.find((product) => product.slug === slug);
}

export async function getRelatedProducts(
  product: Product,
  locale: string,
  limit = 4,
): Promise<Product[]> {
  const products = await getAllProducts(locale);

  return products
    .filter(
      (item) =>
        item.categorySlug === product.categorySlug && item.slug !== product.slug,
    )
    .slice(0, limit);
}

export function getCategoryName(slug: string, categories: Category[]): string {
  return categories.find((category) => category.slug === slug)?.name ?? slug;
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(value);
}
