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
import { ProductCard } from "@/components/site/catalog/product-card";
import { ProductGallery } from "@/components/site/catalog/product-gallery";
import {
  formatPrice,
  getCategoryName,
  getProductBySlug,
  getRelatedProducts,
  getCategories,
} from "@/lib/catalog/data";
import { getPublicSettings } from "@/lib/services/public-settings";
import { getPublicContents } from "@/lib/services/public-contents";

type ProductPageProps = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const product = await getProductBySlug(slug, locale);
  return { title: product ? product.name : "Product not found" };
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug, locale } = await params;
  const product = await getProductBySlug(slug, locale);
  if (!product) notFound();

  const [siteConfig, { data: contents }] = await Promise.all([
    getPublicSettings(),
    getPublicContents("products"),
  ]);
  const isArabic = locale === "ar";
  const getContent = (section: string, key: string, fallback: string) => {
    const getValue = (field: string) =>
      contents?.find((item) => item.section === section && item.key === field)?.value;
    return (isArabic ? getValue(`${key}-ar`) ?? getValue(key) : getValue(key)) ?? fallback;
  };
  const homeLabel = getContent("breadcrumb", "home", isArabic ? "الرئيسية" : "Home");
  const productsLabel = getContent("breadcrumb", "products", isArabic ? "المنتجات" : "Products");
  const inquiryLabel = getContent("product-details", "inquiry-button", isArabic ? "استفسر عن هذا المنتج" : "Inquire About This Product");
  const inquirySubject = getContent("product-details", "inquiry-subject", isArabic ? "استفسار عن المنتج" : "Product inquiry");
  const pricingNote = getContent("product-details", "pricing-note", isArabic ? "الأسعار والتوفر حسب الكتالوج — تواصل معنا للكميات الخاصة بالمشاريع." : "Pricing and availability shown from the catalog — contact us for project quantities.");
  const relatedEyebrow = getContent("related-products", "eyebrow", isArabic ? "منتجات ذات صلة" : "Related");
  const relatedTitle = getContent("related-products", "title", isArabic ? "قد تحتاج أيضًا" : "You may also need");
  const relatedDescription = getContent("related-products", "desc", "");
  const contactEmail = siteConfig?.data.contact?.contact_email;
  const [categories, related] = await Promise.all([
    getCategories(locale),
    getRelatedProducts(product, locale),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-28 lg:px-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={`/${locale}`} />}>
                {homeLabel}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={`/${locale}/products`} />}>
                {productsLabel}
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
                  {product.inStock
                    ? getContent("product-details", "in-stock", isArabic ? "متوفر" : "In stock")
                    : getContent("product-details", "out-of-stock", isArabic ? "غير متوفر" : "Out of stock")}
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
              {getContent("product-details", "sku-label", isArabic ? "رمز المنتج" : "SKU")} · {product.sku}
            </p>
          )}

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={contactEmail
                ? `mailto:${contactEmail}?subject=${encodeURIComponent(`${inquirySubject} — ${product.name}`)}`
                : `/${locale}/contact`}
              className={buttonVariants({ size: "lg" })}
            >
              {inquiryLabel}
            </a>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {pricingNote}
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-28">
          <SectionHeading eyebrow={relatedEyebrow} title={relatedTitle} description={relatedDescription || undefined} />
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {related.map((item, index) => (
              <ProductCard key={item.id} product={item} categories={categories} motionIndex={index} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
