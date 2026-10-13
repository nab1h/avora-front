export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  description: string;
  images: string[];
  /** Rendered only when present — mirrors "price only if the API provides it". */
  price?: number;
  sku?: string;
  inStock?: boolean;
  specs?: ProductSpec[];
}