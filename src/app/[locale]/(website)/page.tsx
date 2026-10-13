import type { Metadata } from "next";
import { getSeo, seoToMetadata } from "@/lib/seo";
import { Hero } from "@/components/home/hero";
import { CategoryShowcase } from "@/components/catalog/category-showcase";
import { FeaturedProducts } from "@/components/home/featured-products";
import { EditorialBanner } from "@/components/home/editorial-banner";
import { Values } from "@/components/home/values";
import { FinalCta } from "@/components/home/final-cta";
import { getAllProducts, getCategories } from "@/lib/catalog/data";

type PageProps = {
	params: Promise<{ locale: "ar" | "en" }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { locale } = await params;
	const seo = await getSeo("home", locale);

	return seoToMetadata(seo);
}

export default async function HomePage() {
	const categories = getCategories();
	const products = getAllProducts();

	return (
		<>
			<Hero />
			<CategoryShowcase categories={categories} />
			<FeaturedProducts products={products} categories={categories} />
			<EditorialBanner />
			<Values />
			<FinalCta />
			</>
	);
}
