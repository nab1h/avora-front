import Link from "next/link";
import Logo from "@/assets/svg/logo";
import SocialPlatformIcon from "@/components/social-platform-icon";
import type { PublicSettingsData, PublicSocialLink } from "@/lib/services/public-settings";

type FooterProps = {
	settings: PublicSettingsData | null;
	siteLogo: string | null;
	socialLinks: PublicSocialLink[];
};

export default function Footer({ settings, siteLogo, socialLinks }: FooterProps) {
	const mapEmbedUrl = settings?.maps?.google_maps_embed_url;
	const siteName = settings?.general?.site_name || "AVORA";
	const siteDescription = settings?.general?.site_description;
	const whatsappNumber = settings?.contact?.contact_whatsapp?.replace(/\D/g, '');

	return (
		<footer className="bg-foreground text-background">
			<div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:py-16">
				<div className="grid gap-10 sm:grid-cols-2">
					<div className="max-w-xs">
						<Link href="/" className="flex items-center gap-3 font-bold">
							{siteLogo ? <img src={siteLogo} alt={siteName} className="size-10 object-contain" /> : <Logo className="size-10" />}
							<span className="text-lg">{siteName}</span>
						</Link>
						{siteDescription && <p className="mt-5 text-sm leading-7 text-background/65">{siteDescription}</p>}
					</div>

					<div>
						<h2 className="font-semibold">Contact</h2>
						<div className="mt-3 space-y-2 text-sm leading-6 text-background/65">
							{settings?.contact?.contact_email && (
								<a className="block hover:text-background" href={`mailto:${settings.contact.contact_email}`}>
									{settings.contact.contact_email}
								</a>
							)}
							{settings?.contact?.contact_phone && (
								<a className="block hover:text-background" href={`tel:${settings.contact.contact_phone}`}>
									{settings.contact.contact_phone}
								</a>
							)}
							{whatsappNumber && (
								<a
									href={`https://wa.me/${whatsappNumber}`}
									target="_blank"
									rel="noreferrer"
									aria-label="Contact us on WhatsApp"
									className="inline-flex items-center gap-2 text-background/75 hover:text-background"
								>
									<SocialPlatformIcon icon="whatsapp" className="size-4" />
									<span>WhatsApp</span>
								</a>
							)}
							{settings?.contact?.contact_address && <p>{settings.contact.contact_address}</p>}
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
											className="inline-flex size-9 items-center justify-center rounded-full border border-background/20 text-background/75 transition-colors hover:bg-background/10 hover:text-background"
										>
											<SocialPlatformIcon icon={socialLink.platform.icon} className="size-4" />
										</a>
									))}
								</div>
							)}
							{settings?.maps?.google_maps_url && (
								<a
									href={settings.maps.google_maps_url}
									target="_blank"
									rel="noreferrer"
									className="inline-block text-background underline underline-offset-4"
								>
									Open map
								</a>
							)}
						</div>
						{mapEmbedUrl?.includes("/maps/embed") && (
							<iframe
								src={mapEmbedUrl}
								title="Google Maps location"
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
								className="mt-5 h-36 w-full rounded-md border-0"
							/>
						)}
					</div>
				</div>

				<div className="mt-14 flex flex-col gap-3 border-t border-background/15 pt-6 text-xs text-background/50 sm:flex-row sm:items-center sm:justify-between">
					<span>© {new Date().getFullYear()} {siteName}</span>
					<span>All rights reserved</span>
				</div>
			</div>
		</footer>
	);
}
