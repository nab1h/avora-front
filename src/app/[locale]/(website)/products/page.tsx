import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ProductBrowser } from "@/components/catalog/product-browser";
import { getAllProducts, getCategories } from "@/lib/catalog/data";
import Link from "next/link";

export const metadata = { title: "Products" };

export default async function ProductsPage({
  searchParams,
}: {
  // Next.js ≤ 14: searchParams is a plain object — remove `await`.
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const categories = getCategories();

  return (
    <main className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-28 lg:px-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Products</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-8 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Products
        </h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          The complete catalog — browse by category, search by name, or sort by
          what matters to your project.
        </p>
      </div>

      <div className="mt-12">
        <ProductBrowser
          products={getAllProducts()}
          categories={categories}
          initialQuery={q ?? ""}
          initialCategory={category ?? "all"}
        />
      </div>
    </main>
  );
}
