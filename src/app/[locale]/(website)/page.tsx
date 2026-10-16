import type { Metadata } from "next";
import { getSeo, seoToMetadata } from "@/lib/seo";
import { Hero } from "@/components/site/home/hero";
import { FeaturedProducts } from "@/components/site/home/featured-products";
import { EditorialBanner } from "@/components/site/home/editorial-banner";
import { Values } from "@/components/site/home/values";
import { FinalCta } from "@/components/site/home/final-cta";
import { getAllProducts, getCategories } from "@/lib/catalog/data";
import { getPublicContents } from "@/lib/services/public-contents";
import CategoriesPage from "./categories/page";

type PageProps = {
	params: Promise<{ locale: "ar" | "en" }>;
};


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { locale } = await params;
	const seo = await getSeo("home", locale);

	return seoToMetadata(seo);
}

export default async function HomePage({ params }: PageProps) {
	const categories = getCategories();
	const products = getAllProducts();
	const { locale } = await params;
	const { data } = await getPublicContents("home");
	const contents = data ?? [];


	const getContent = (section: string, key: string) => {
		return contents.find(
			(item) =>
				item.section === section &&
				item.key === key
		);
	};

	const title = getContent("hero", "title");
	const subtitle = getContent("hero", "subtitle");
	const title_ar = getContent("hero", "title_ar");
	const subtitle_ar = getContent("hero", "subtitle_ar");
	const pageTitle = (locale === "ar" ? title_ar?.value ?? title?.value : title?.value) ?? undefined;
	const pageSubtitle = (locale === "ar" ? subtitle_ar?.value ?? subtitle?.value : subtitle?.value) ?? undefined;
	// button
	const productButton = getContent("button", "to-product");
	const productButtonAr = getContent("button", "to-product-ar");
	const catButton = getContent("button", "to-cat");
	const catButtonAr = getContent("button", "to-cat-at");
	const proButton = (locale === "ar" ? productButtonAr?.value ?? productButton?.value : productButton?.value) ?? undefined;
	const cateButton = (locale === "ar" ? catButtonAr?.value ?? catButton?.value : catButton?.value) ?? undefined;


	const featuredTitle = getContent("products", locale === "ar" ? "title-ar" : "title");
	const featuredDescription = getContent("products", locale === "ar"
		? "desc-ar"
		: "desc");
	const featuredEyebrow = getContent("eyebrow", locale === "ar" ? "منتجات مميزة" : "Featured");


	return (
		<>
			<Hero title={pageTitle} subtitle={pageSubtitle} proButton={proButton} cateButton={cateButton} />
			<CategoriesPage params={params} />
			<FeaturedProducts products={products} categories={categories} title={featuredTitle?.value ?? undefined} description={featuredDescription?.value ?? undefined} eyebrow={featuredEyebrow?.value ?? undefined} />
			<EditorialBanner params={params}/>
			<Values params={params} />
			<FinalCta params={params}/>
			</>
	);
}
