import Link from "next/link";

// SEO
import type { Metadata } from "next";
import { getSeo, seoToMetadata } from "@/lib/seo";

// Content
import { getPublicContents } from "@/lib/services/public-contents";

type PageProps = {
	params: Promise<{ locale: "ar" | "en" }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { locale } = await params;
	const seo = await getSeo("home", locale);

	return seoToMetadata(seo);
}

export default async function HomePage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
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
	const pageTitle = locale === "ar" ? title_ar?.value ?? title?.value : title?.value;
	const pageSubtitle = locale === "ar" ? subtitle_ar?.value ?? subtitle?.value : subtitle?.value;

	return (
		<section className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-6xl items-center px-4 py-16 sm:px-6">
			<div className="max-w-2xl">
				<p className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
					Avora
				</p>

				<h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
					{pageTitle}
				</h1>

				<p className="mt-6 max-w-xl text-lg text-muted-foreground">
					{pageSubtitle}
				</p>

				<Link
					href="/auth/register"
					className="mt-8 inline-flex rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
				>
					Start now
				</Link>
			</div>
		</section>
	);
}