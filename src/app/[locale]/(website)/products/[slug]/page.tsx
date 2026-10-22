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
import { SectionHeading } from "@/components/shared/section-heading";
import { ProductCard } from "@/components/site/catalog/product-card";
import { ProductGallery } from "@/components/site/catalog/product-gallery";
import { ProductInquiry } from "@/components/site/catalog/product-inquiry";
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
  const whatsapp = siteConfig?.data.contact?.contact_whatsapp;
  const [categories, related] = await Promise.all([
    getCategories(locale),
    getRelatedProducts(product, locale),
  ]);
  const categoryName = getCategoryName(product.categorySlug, categories);

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
            {categoryName}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {product.name}
          </h1>

          {(product.price !== undefined || product.inStock !== undefined) && (
            <div className="mt-5 flex flex-wrap items-center gap-4">
              {product.price !== undefined && (
                <span className="text-2xl font-semibold tabular-nums">
                  {formatPrice(product.price)}
                </span>
              )}
              {product.originalPrice !== undefined && (
                <del className="text-lg tabular-nums text-muted-foreground">
                  {formatPrice(product.originalPrice)}
                </del>
              )}
              {product.originalPrice !== undefined && product.price !== undefined && product.originalPrice > 0 && (
                <Badge variant="secondary">
                  {isArabic ? "خصم" : "Save"} {Math.round((1 - product.price / product.originalPrice) * 100)}%
                </Badge>
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

          {product.description && <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground sm:text-base">
            {product.description}
          </p>}

          {product.specs && product.specs.length > 0 && (
            <section className="mt-8" aria-labelledby="product-specifications">
              <h2 id="product-specifications" className="mb-4 text-base font-semibold">{isArabic ? "المواصفات الفنية" : "Technical specifications"}</h2>
            <dl className="divide-y divide-border border-y border-border">
              {product.specs.map((spec, index) => (
                <div key={`${spec.label}-${index}`} className="grid grid-cols-2 items-baseline gap-4 py-3 text-sm">
                  <dt className="text-muted-foreground">{spec.label}</dt>
                  <dd className="whitespace-pre-line break-words text-end font-medium tabular-nums">{spec.value}</dd>
                </div>
              ))}
            </dl>
            </section>
          )}

          {product.sku && (
            <p className="mt-5 text-xs tracking-wide text-muted-foreground">
              {getContent("product-details", "sku-label", isArabic ? "رمز المنتج" : "SKU")} · {product.sku}
            </p>
          )}

          <ProductInquiry product={product} categoryName={categoryName} locale={locale} whatsapp={whatsapp} label={inquiryLabel} subject={inquirySubject} />
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
              <ProductCard key={item.id} product={item} categories={categories} motionIndex={index} isArabic={isArabic} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
