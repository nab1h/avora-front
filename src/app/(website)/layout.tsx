import Footer from "./_components/layout/footer";
import Header from "./_components/layout/header";
import FloatingContactButtons from "./_components/layout/floating-contact-buttons";
import {
	getPublicAssetUrl,
	getPublicSettings,
	getPublicSocialLinks,
} from "@/lib/services/public-settings";

type WebsiteLayoutProps = {
	children: React.ReactNode;
<<<<<<< HEAD
=======
	params?: Promise<Record<string, string>>;
>>>>>>> cd13c45 (done content manage)
};

export default async function WebsiteLayout({
	children
}: WebsiteLayoutProps) {
<<<<<<< HEAD
	return (
		<div className="flex min-h-screen flex-col bg-background">
			<Header />

			<main className="flex-1">{children}</main>

			<Footer />
=======
	const [settings, socialLinks] = await Promise.all([
		getPublicSettings(),
		getPublicSocialLinks(),
	]);
	const siteName = settings?.data.general?.site_name || 'AVORA';
	const siteLogo = getPublicAssetUrl(settings?.data.branding?.site_logo);

	return (
		<div className="flex min-h-screen flex-col bg-background">
			<Header siteName={siteName} siteLogo={siteLogo} />

			<main className="flex-1">{children}</main>

			<Footer settings={settings?.data ?? null} siteLogo={siteLogo} socialLinks={socialLinks} />
			<FloatingContactButtons
				phone={settings?.data.contact?.contact_phone}
				whatsapp={settings?.data.contact?.contact_whatsapp}
			/>
>>>>>>> cd13c45 (done content manage)
		</div>
	);
}
