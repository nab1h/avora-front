import Link from "next/link";

type HomePageProps = {
	params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
	const { locale } = await params;
	const isArabic = locale === "ar";

	return (
		<section className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-6xl items-center px-4 py-16 sm:px-6">
			<div className="max-w-2xl">
				<p className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
					AVORA
				</p>
				<h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
					{isArabic ? "أدر عملك ببساطة" : "Manage your work simply"}
				</h1>
				<p className="mt-6 max-w-xl text-lg text-muted-foreground">
					{isArabic
						? "كل الأدوات التي تحتاجها في مكان واحد وبواجهة واضحة."
						: "Everything you need in one clear and simple workspace."}
				</p>
				<Link
					href={`/${locale}/auth/register`}
					className="mt-8 inline-flex rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
				>
					{isArabic ? "ابدأ الآن" : "Start now"}
				</Link>
			</div>
		</section>
	);
}