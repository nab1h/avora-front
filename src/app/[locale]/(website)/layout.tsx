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
	params: Promise<{ locale: string }>;
};

export default async function WebsiteLayout({
	children,
	params,
}: WebsiteLayoutProps) {
<<<<<<< HEAD:src/app/[locale]/(website)/layout.tsx
	const { locale } = await params;
	const [settings, socialLinks] = await Promise.all([
=======
	const [settings, socialLinks, siteScripts] = await Promise.all([
>>>>>>> 7660d52 (done scripts):src/app/(website)/layout.tsx
		getPublicSettings(),
		getPublicSocialLinks(),
		getPublicSiteScripts(),
	]);
	const siteName = settings?.data.general?.site_name || 'AVORA';
	const siteLogo = getPublicAssetUrl(settings?.data.branding?.site_logo);

	return (
		<div className="flex min-h-screen flex-col bg-background">
<<<<<<< HEAD:src/app/[locale]/(website)/layout.tsx
			<Header locale={locale} siteName={siteName} siteLogo={siteLogo} />
=======
			<SiteScriptsLoader scripts={siteScripts} placement="head" />
			<Header siteName={siteName} siteLogo={siteLogo} />
			<SiteScriptsLoader scripts={siteScripts} placement="body_start" />
>>>>>>> 7660d52 (done scripts):src/app/(website)/layout.tsx

			<main className="flex-1">{children}</main>
			<SiteScriptsLoader scripts={siteScripts} placement="body_end" />

			<Footer locale={locale} settings={settings?.data ?? null} siteLogo={siteLogo} socialLinks={socialLinks} />
			<FloatingContactButtons
				phone={settings?.data.contact?.contact_phone}
				whatsapp={settings?.data.contact?.contact_whatsapp}
			/>
		</div>
	);
}
