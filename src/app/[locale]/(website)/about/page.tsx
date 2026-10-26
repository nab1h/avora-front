import { Compass, HeartHandshake, Layers3 } from "lucide-react";
import Image from "next/image";
import Logo from "@/assets/svg/logo";
import { Badge } from "@/components/ui/badge";
import {
	getPublicAssetUrl,
	getPublicSettings,
} from "@/lib/services/public-settings";

// ====== seo ======
import type { Metadata } from "next";
import { getSeo, seoToMetadata } from "@/lib/seo";
import { getPublicContents } from "@/lib/services/public-contents";

export async function generateMetadata(): Promise<Metadata> {
	const seo = await getSeo("about", "en");

	return seoToMetadata(seo);
}

export default async function AboutPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const settings = await getPublicSettings();
	const siteName = settings?.data.general?.site_name || "AVORA";

	const { data } = await getPublicContents("about");
	const contents = data ?? [];

	const getContent = (section: string, key: string) => {
		return contents.find(
			(item) =>
				item.section === section &&
				item.key === key
		);
	};

	const title = getContent("general", "title");
	const title_ar = getContent("general", "title_ar");
	const subtitle = getContent("general", "subtitle");
	const subtitle_ar = getContent("general", "subtitle_ar");
	const image = getContent("general", "image");
	const pageTitle = locale === "ar" ? title_ar?.value ?? title?.value : title?.value;
	const pageSubtitle = locale === "ar" ? subtitle_ar?.value ?? subtitle?.value : subtitle?.value;


	return (
		<main className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
			<section className="grid items-center gap-14 md:grid-cols-[1fr_0.8fr]">
				<div className="max-w-2xl">
					<h1 className="text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl">
						{pageTitle ?? "fix"}
					</h1>
					<p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
						{pageSubtitle ?? `About ${siteName}`}
					</p>
				</div>
				<div className="mx-auto flex min-h-[360px] w-full items-center justify-center rounded-none border bg-muted/50 sm:min-h-[480px]">

					<div className="relative min-h-[460px] w-full overflow-hidden bg-transparent sm:min-h-[580px] lg:min-h-[640px]">
						<Image
							src={
								getPublicAssetUrl(image?.value) ??
								"/images/illustrations/undraw_rocket.svg"
							}
							alt="Illustration"
							fill
							sizes="(max-width: 768px) 100vw, 40vw"
							unoptimized
							className="object-cover object-center"
						/>
					</div>
				</div>
			</section>
		</main>
	);
}
