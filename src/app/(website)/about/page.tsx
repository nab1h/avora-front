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
	const seo = await getSeo("about");

	return seoToMetadata(seo);
}

export default async function AboutPage() {
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

	const title = getContent("section", "title");
	const subtitle = getContent("section", "subtitle");
	const image = getContent("section", "image");

	return (
		<main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
			<section className="grid items-center gap-12 md:grid-cols-[1fr_auto]">
				<div className="max-w-2xl">
					<Badge variant="secondary" className="mb-5 gap-2 px-3 py-1">
						<Logo aria-hidden="true" className="size-4" />
						About {siteName}
					</Badge>
					<h1 className="text-4xl font-bold leading-tight sm:text-5xl">
						{title?.value ?? "fix"}
					</h1>
					<p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
						{subtitle?.value ?? `About ${siteName}`}
					</p>
				</div>
				<div className="mx-auto flex size-40 items-center justify-center rounded-2xl border bg-muted/50 sm:size-52">
					<div className="relative mx-auto flex size-40 items-center justify-center overflow-hidden rounded-2xl border bg-muted/50 sm:size-52">
						<Image
							src={getPublicAssetUrl(image?.value) ?? "/images/illustrations/undraw_rocket.svg"}
							alt="Illustration"
							fill
							sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
							unoptimized
							className="object-cover"
						/>
					</div>
				</div>
			</section>
		</main>
	);
}
