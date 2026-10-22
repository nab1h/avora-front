import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, getCategoryName } from "@/lib/catalog/data";
import type { Category, Product } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/shared/reveal";

export function ProductCard({
  product,
  categories,
  className,
  motionIndex = 0,
  isArabic,
}: {
  product: Product;
  categories: Category[];
  className?: string;
  motionIndex?: number;
  isArabic: boolean;
}) {
  const isOnSale =
    product.price !== undefined &&
    product.originalPrice !== undefined &&
    product.originalPrice > product.price;

  return (
    <Reveal variant="fade-up" duration={650} delay={(motionIndex % 4) * 65} className="min-w-0">
    <Link
      href={`/products/${product.slug}`}
      className={cn("product-motion group block focus-visible:outline-none", className)}
    >
      <div className="product-media relative aspect-[4/5] overflow-hidden rounded-md border bg-muted">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 50vw"
          className="product-image object-cover"
        />
        <div className="absolute end-3 top-3 flex flex-col items-end gap-2">
          {isOnSale && (
            <Badge>
              {isArabic ? "خصم" : "Sale"}
            </Badge>
          )}
          {product.isNew && (
            <Badge variant="secondary">
              {isArabic ? "جديد" : "New"}
            </Badge>
          )}
        </div>
        {product.inStock === false && (
          <span className="absolute start-3 top-3 rounded-sm bg-background/90 px-2 py-1 text-[11px] font-medium text-foreground">
            {isArabic ? "غير متوفر" : "Out of stock"}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-medium">{product.name}</h3>
          <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {getCategoryName(product.categorySlug, categories)}
          </p>
        </div>
        {product.price !== undefined && (
          <span className="shrink-0 text-sm font-semibold tabular-nums">
            {formatPrice(product.price)}
          </span>
        )}
      </div>

      <p className="product-details mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        View details
        <ArrowUpRight className="product-arrow size-3.5 rtl:-rotate-90" aria-hidden="true" />
      </p>
    </Link>
    </Reveal>
  );
}

export function ProductCardSkeleton() {
  return (
    <div aria-hidden="true">
      <Skeleton className="aspect-[4/5] w-full rounded-md" />
      <Skeleton className="mt-4 h-4 w-3/4" />
      <Skeleton className="mt-2 h-3 w-1/2" />
    </div>
  );
}

export function ProductCardSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
