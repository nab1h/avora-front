import Footer from "./_components/layout/footer";
import Header from "./_components/layout/header";

type WebsiteLayoutProps = {
	children: React.ReactNode;
};

export default async function WebsiteLayout({
	children
}: WebsiteLayoutProps) {
	return (
		<div className="flex min-h-screen flex-col bg-background">
			<Header />

			<main className="flex-1">{children}</main>

			<Footer />
		</div>
	);
}
