// app/products/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCardSkeletonGrid } from "@/components/catalog/product-card";

export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-28 lg:px-8" aria-busy="true">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-8 h-10 w-52" />
      <Skeleton className="mt-3 h-4 w-80" />
      <div className="mt-12 flex flex-wrap gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-9 w-28 rounded-full" />
        ))}
      </div>
      <div className="mt-12">
        <ProductCardSkeletonGrid />
      </div>
    </main>
  );
}