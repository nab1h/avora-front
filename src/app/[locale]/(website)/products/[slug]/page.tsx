import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProductCard } from "@/components/catalog/product-card";
import { ProductGallery } from "@/components/catalog/product-gallery";
import {
  formatPrice,
  getAllProducts,
  getCategoryName,
  getProductBySlug,
  getRelatedProducts,
  getCategories,
} from "@/lib/catalog/data";
import { siteConfig } from "@/lib/site/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  return { title: product ? `${product.name} — ${siteConfig.name}` : "Product not found" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>; // Next ≤14: plain object, remove `await`
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const categories = getCategories();
  const related = getRelatedProducts(product);

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
            <BreadcrumbLink render={<Link href="/products" />}>
                Products
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="max-w-40 truncate">
              {product.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} alt={product.name} />

        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            {getCategoryName(product.categorySlug, categories)}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {product.name}
          </h1>

          {(product.price !== undefined || product.inStock !== undefined) && (
            <div className="mt-5 flex items-center gap-4">
              {product.price !== undefined && (
                <span className="text-2xl font-semibold tabular-nums">
                  {formatPrice(product.price)}
                </span>
              )}
              {product.inStock !== undefined && (
                <Badge variant={product.inStock ? "secondary" : "outline"}>
                  {product.inStock ? "In stock" : "Out of stock"}
                </Badge>
              )}
            </div>
          )}

          <Separator className="my-7" />

          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            {product.description}
          </p>

          {product.specs && product.specs.length > 0 && (
            <dl className="mt-8 divide-y divide-border border-y border-border">
              {product.specs.map((spec) => (
                <div key={spec.label} className="flex items-baseline justify-between py-3 text-sm">
                  <dt className="text-muted-foreground">{spec.label}</dt>
                  <dd className="font-medium tabular-nums">{spec.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {product.sku && (
            <p className="mt-5 text-xs tracking-wide text-muted-foreground">
              SKU · {product.sku}
            </p>
          )}

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={`mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
                `Product inquiry — ${product.name}`
              )}`}
              className={buttonVariants({ size: "lg" })}
            >
              Inquire About This Product
            </a>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Pricing and availability shown from the catalog — contact us for
            project quantities.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-28">
          <SectionHeading eyebrow="Related" title="You may also need" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} categories={categories} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
