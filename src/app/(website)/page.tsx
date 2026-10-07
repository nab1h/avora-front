import Link from "next/link";
import { getPublicSettings } from "@/lib/services/public-settings";

// SEO
import type { Metadata } from "next";
import { getSeo, seoToMetadata } from "@/lib/seo";

// Content
import { getPublicContents } from "@/lib/services/public-contents";

export async function generateMetadata(): Promise<Metadata> {
	const seo = await getSeo("home");

	return seoToMetadata(seo);
}

export default async function HomePage() {
	const settings = await getPublicSettings();

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

	return (
		<section className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-6xl items-center px-4 py-16 sm:px-6">
			<div className="max-w-2xl">
				<p className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
					Avora
				</p>

				<h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
					{title?.value ?? "Welcome to Avora"}
				</h1>

				<p className="mt-6 max-w-xl text-lg text-muted-foreground">
					{subtitle?.value ?? "Manage your work simply"}
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