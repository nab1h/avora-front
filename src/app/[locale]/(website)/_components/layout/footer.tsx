import Link from "next/link";
import Logo from "@/assets/svg/logo";
import SocialPlatformIcon from "@/components/social-platform-icon";
import { getCategories } from "@/lib/catalog/data";
import FooterServices from "./footer-services";
import type {
	PublicSettingsData,
	PublicSocialLink,
} from "@/lib/services/public-settings";

type FooterProps = {
	locale: string;
	settings: PublicSettingsData | null;
	siteLogo: string | null;
	socialLinks: PublicSocialLink[];
};

export default function Footer({
	settings,
	siteLogo,
	socialLinks,
	locale,
}: FooterProps) {
	const isArabic = locale === "ar";
	const categories = getCategories();

	const mapEmbedUrl = settings?.maps?.google_maps_embed_url;
	const siteName = settings?.general?.site_name || "AVORA";
	const siteDescription = settings?.general?.site_description;

	const whatsappNumber = settings?.contact?.contact_whatsapp?.replace(
		/\D/g,
		"",
	);

	const homeHref = `/${locale}`;

	return (
		<footer className="bg-brand-charcoal text-brand-white">
			<div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
				<div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.65fr_0.85fr_0.85fr_1.2fr]">
					{/* Brand */}
					<div className="max-w-xs sm:col-span-2 lg:col-span-1">
						<Link
							href={homeHref}
							className="flex items-center gap-3 font-bold"
						>
							{siteLogo ? (
								<img
									src={siteLogo}
									alt={siteName}
									className="size-17 object-contain"
								/>
							) : (
								<Logo className="size-10" />
							)}
						</Link>

						{siteDescription && (
							<p className="mt-5 text-sm leading-7 text-brand-white/65">
								{siteDescription}
							</p>
						)}
					</div>

					{/* Navigation */}
					<div>
						<h2 className="font-semibold">
							{isArabic ? "الروابط" : "Links"}
						</h2>

						<div className="mt-3 space-y-2 text-sm leading-6 text-brand-white/65">
							<Link
								href={homeHref}
								className="block transition-colors hover:text-brand-white"
							>
								{isArabic ? "الرئيسية" : "Home"}
							</Link>

							<Link
								href={`/${locale}/about`}
								className="block transition-colors hover:text-brand-white"
							>
								{isArabic ? "من نحن" : "About"}
							</Link>

							<Link
								href={`/${locale}/services`}
								className="block transition-colors hover:text-brand-white"
							>
								{isArabic ? "الخدمات" : "Services"}
							</Link>

							<Link
								href={`/${locale}/contact`}
								className="block transition-colors hover:text-brand-white"
							>
								{isArabic ? "تواصل معنا" : "Contact"}
							</Link>
						</div>
					</div>

					{/* Services */}
					<div className="min-w-0">
						<h2 className="font-semibold">{isArabic ? "الخدمات" : "Services"}</h2>
						<FooterServices locale={locale} />
					</div>

					{/* Categories */}
					<div className="min-w-0">
						<h2 className="font-semibold">{isArabic ? "التصنيفات" : "Categories"}</h2>
						<div className="mt-3 space-y-2 text-sm leading-6 text-brand-white/65">
							{categories.map((category) => (
								<Link key={category.id} href={`/${locale}/products?category=${encodeURIComponent(category.slug)}`} className="block break-words transition-colors hover:text-brand-white">
									{category.name}
								</Link>
							))}
							<Link href={`/${locale}/categories`} className="block pt-2 font-medium text-brand-white underline underline-offset-4">
								{isArabic ? "جميع التصنيفات" : "All categories"}
							</Link>
						</div>
					</div>

					{/* Contact */}
					<div className="min-w-0">
						<h2 className="font-semibold">
							{isArabic ? "تواصل معنا" : "Contact"}
						</h2>

						<div className="mt-3 space-y-2 text-sm leading-6 text-brand-white/65 [overflow-wrap:anywhere]">
							{settings?.contact?.contact_email && (
								<a
									className="block hover:text-brand-white"
									href={`mailto:${settings.contact.contact_email}`}
								>
									{settings.contact.contact_email}
								</a>
							)}

							{settings?.contact?.contact_phone && (
								<a
									className="block hover:text-brand-white"
									href={`tel:${settings.contact.contact_phone}`}
								>
									{settings.contact.contact_phone}
								</a>
							)}

							{whatsappNumber && (
								<a
									href={`https://wa.me/${whatsappNumber}`}
									target="_blank"
									rel="noreferrer"
									aria-label={
										isArabic
											? "تواصل معنا عبر واتساب"
											: "Contact us on WhatsApp"
									}
									className="inline-flex items-center gap-2 text-brand-white/75 hover:text-brand-white"
								>
									<SocialPlatformIcon
										icon="whatsapp"
										className="size-4"
									/>
									<span>
										{isArabic ? "واتساب" : "WhatsApp"}
									</span>
								</a>
							)}

							{settings?.contact?.contact_address && (
								<p>{settings.contact.contact_address}</p>
							)}

							{socialLinks.length > 0 && (
								<div className="flex flex-wrap gap-2 pt-2">
									{socialLinks.map((socialLink) => (
										<a
											key={socialLink.id}
											href={socialLink.url}
											target="_blank"
											rel="noreferrer"
											aria-label={socialLink.platform.name}
											title={socialLink.platform.name}
											className="inline-flex size-9 items-center justify-center rounded-full border border-brand-white/20 text-brand-white/75 transition-colors hover:bg-brand-white/10 hover:text-brand-white"
										>
											<SocialPlatformIcon
												icon={socialLink.platform.icon}
												className="size-4"
											/>
										</a>
									))}
								</div>
							)}

							{settings?.maps?.google_maps_url && (
								<a
									href={settings.maps.google_maps_url}
									target="_blank"
									rel="noreferrer"
									className="inline-block text-brand-white underline underline-offset-4"
								>
									{isArabic ? "فتح الخريطة" : "Open map"}
								</a>
							)}
						</div>

						{mapEmbedUrl?.includes("/maps/embed") && (
							<iframe
								src={mapEmbedUrl}
								title={
									isArabic
										? "موقعنا على الخريطة"
										: "Google Maps location"
								}
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
								className="mt-5 h-36 w-full rounded-md border-0"
							/>
						)}
					</div>
				</div>

				<div className="mt-14 flex flex-col gap-3 border-t border-brand-white/15 pt-6 text-xs text-brand-white/50 sm:flex-row sm:items-center sm:justify-between">
					<span>
						© {new Date().getFullYear()} {siteName}
					</span>

					<span>
						{isArabic
							? "جميع الحقوق محفوظة"
							: "All rights reserved"}
					</span>
				</div>
			</div>
		</footer>
	);
}
