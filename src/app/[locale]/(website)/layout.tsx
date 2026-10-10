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
<<<<<<< HEAD
	return (
		<div className="flex min-h-screen flex-col bg-background">
			<Header locale={locale} />

			<main className="flex-1">{children}</main>

			<Footer locale={locale} />
=======
	const [settings, socialLinks] = await Promise.all([
		getPublicSettings(),
		getPublicSocialLinks(),
	]);
	const siteName = settings?.data.general?.site_name || 'AVORA';
	const siteLogo = getPublicAssetUrl(settings?.data.branding?.site_logo);

	return (
		<div className="flex min-h-screen flex-col bg-background">
			<Header locale={locale} siteName={siteName} siteLogo={siteLogo} />

			<main className="flex-1">{children}</main>

			<Footer locale={locale} settings={settings?.data ?? null} siteLogo={siteLogo} socialLinks={socialLinks} />
			<FloatingContactButtons
				phone={settings?.data.contact?.contact_phone}
				whatsapp={settings?.data.contact?.contact_whatsapp}
			/>
>>>>>>> dfc30d2 (finish finish)
		</div>
	);
}
