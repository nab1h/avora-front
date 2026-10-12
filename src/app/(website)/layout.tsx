import Footer from "./_components/layout/footer";
import Header from "./_components/layout/header";
import FloatingContactButtons from "./_components/layout/floating-contact-buttons";
import SiteScriptsLoader from "./_components/site-scripts-loader";
import {
	getPublicAssetUrl,
	getPublicSettings,
	getPublicSocialLinks,
} from "@/lib/services/public-settings";
import { getPublicSiteScripts } from "@/lib/services/public-site-scripts";

type WebsiteLayoutProps = {
	children: React.ReactNode;
	params?: Promise<Record<string, string>>;
};

export default async function WebsiteLayout({
	children,
	params,
}: WebsiteLayoutProps) {
	const [settings, socialLinks, siteScripts] = await Promise.all([
		getPublicSettings(),
		getPublicSocialLinks(),
		getPublicSiteScripts(),
	]);
	const siteName = settings?.data.general?.site_name || 'AVORA';
	const siteLogo = getPublicAssetUrl(settings?.data.branding?.site_logo);

	return (
		<div className="flex min-h-screen flex-col bg-background">
			<SiteScriptsLoader scripts={siteScripts} placement="head" />
			<Header siteName={siteName} siteLogo={siteLogo} />
			<SiteScriptsLoader scripts={siteScripts} placement="body_start" />

			<main className="flex-1">{children}</main>
			<SiteScriptsLoader scripts={siteScripts} placement="body_end" />

			<Footer settings={settings?.data ?? null} siteLogo={siteLogo} socialLinks={socialLinks} />
			<FloatingContactButtons
				phone={settings?.data.contact?.contact_phone}
				whatsapp={settings?.data.contact?.contact_whatsapp}
			/>
		</div>
	);
}
