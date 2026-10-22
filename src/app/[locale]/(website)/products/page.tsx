import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ProductBrowser } from "@/components/site/catalog/product-browser";
import { getAllProducts, getCategories } from "@/lib/catalog/data";
import Link from "next/link";
import type { Metadata } from "next";
import { getSeo, seoToMetadata } from "@/lib/seo";
import { getPublicContents } from "@/lib/services/public-contents";

type ProductsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; category?: string }>;
};

export async function generateMetadata({
  params,
}: Pick<ProductsPageProps, "params">): Promise<Metadata> {
  const { locale } = await params;
  const seo = await getSeo("products", locale);
  return seoToMetadata(seo);
}

export default async function ProductsPage({
  params,
  searchParams,
}: ProductsPageProps) {
  const { locale } = await params;
  const { q, category } = await searchParams;
  const { data } = await getPublicContents("products");
  const contents = data ?? [];
  const isArabic = locale === "ar";
  const getContent = (key: string) =>
    contents.find((item) => item.section === "products" && item.key === key)?.value;
  const title = (isArabic ? getContent("title-ar") ?? getContent("title") : getContent("title"))
    ?? (isArabic ? "المنتجات" : "Products");
  const description = (isArabic ? getContent("desc-ar") ?? getContent("desc") : getContent("desc"))
    ?? (isArabic
      ? "تصفح الكتالوج الكامل حسب التصنيف، وابحث بالاسم أو رتّب المنتجات بما يناسب مشروعك."
      : "The complete catalog — browse by category, search by name, or sort by what matters to your project.");
  const [categories, products] = await Promise.all([
    getCategories(locale),
    getAllProducts(locale),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-28 lg:px-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={`/${locale}`} />}>
              {isArabic ? "الرئيسية" : "Home"}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-8 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          {description}
        </p>
      </div>

      <div className="mt-12">
        <ProductBrowser
          products={products}
          categories={categories}
          initialQuery={q ?? ""}
          initialCategory={category ?? "all"}
        />
      </div>
    </main>
  );
}
