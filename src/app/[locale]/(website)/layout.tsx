import Footer from "./_components/layout/footer";
import Header from "./_components/layout/header";

type WebsiteLayoutProps = {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
};

export default async function WebsiteLayout({
	children,
	params,
}: WebsiteLayoutProps) {
	const { locale } = await params;
	return (
		<div className="flex min-h-screen flex-col bg-background">
			<Header locale={locale} />

			<main className="flex-1">{children}</main>

			<Footer locale={locale} />
		</div>
	);
}
