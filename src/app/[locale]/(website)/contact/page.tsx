import { Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import Logo from "@/assets/svg/logo";
import { Badge } from "@/components/ui/badge";
import SocialPlatformIcon from "@/components/social-platform-icon";
import { getSeo, seoToMetadata } from "@/lib/seo";
import {
	getPublicSettings,
	getPublicSocialLinks,
} from "@/lib/services/public-settings";

type ContactPageProps = {
	params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
	const { locale } = await params;
	const seo = await getSeo("contact", locale);
	return seoToMetadata(seo);
}

export default async function ContactPage({ params }: ContactPageProps) {
	const { locale } = await params;
	const isArabic = locale === "ar";
	const [settings, socialLinks] = await Promise.all([
		getPublicSettings(),
		getPublicSocialLinks(),
	]);
	const siteName = settings?.data.general?.site_name || "AVORA";
	const contact = settings?.data.contact;
	const maps = settings?.data.maps;
	const mapEmbedUrl = maps?.google_maps_embed_url;

	const contactItems = [
		{
			label: isArabic ? "رقم الهاتف" : "Phone number",
			value: contact?.contact_phone,
			href: contact?.contact_phone ? `tel:${contact.contact_phone}` : undefined,
			icon: Phone,
		},
		{
			label: isArabic ? "البريد الإلكتروني" : "Email address",
			value: contact?.contact_email,
			href: contact?.contact_email ? `mailto:${contact.contact_email}` : undefined,
			icon: Mail,
		},
		{
			label: isArabic ? "العنوان" : "Address",
			value: isArabic
				? contact?.contact_address_ar || contact?.contact_address
				: contact?.contact_address,
			icon: MapPin,
		},
	];

	return (
		<main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
			<section>
				<Badge variant="secondary" className="mb-5 gap-2 px-3 py-1">
					<Logo aria-hidden="true" className="size-4" />
					{isArabic ? `تواصل مع ${siteName}` : `Contact ${siteName}`}
				</Badge>
				<h1 className="text-4xl font-bold leading-tight sm:text-5xl">
					{isArabic ? "يسعدنا تواصلك معنا" : "Get in touch"}
				</h1>

				<div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{contactItems.map(({ label, value, href, icon: Icon }) => (
						<div key={label} className="flex min-h-36 gap-4 rounded-lg border p-5">
							<span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-muted text-foreground">
								<Icon aria-hidden="true" className="size-5" />
							</span>
							<div className="min-w-0">
								<h2 className="font-semibold">{label}</h2>
								{value ? (
									href ? (
										<a className="mt-2 block break-words text-muted-foreground hover:text-foreground" href={href}>
											{value}
										</a>
									) : (
										<p className="mt-2 whitespace-pre-line break-words text-muted-foreground">{value}</p>
									)
								) : (
									<p className="mt-2 text-sm text-muted-foreground">
										{isArabic ? "لم تتم إضافة هذه البيانات بعد" : "Not provided yet"}
									</p>
								)}
							</div>
						</div>
					))}
				</div>

				{socialLinks.length > 0 && (
					<div className="mt-10">
						<h2 className="font-semibold">
							{isArabic ? "تابعنا على" : "Follow us"}
						</h2>
						<div className="mt-4 flex flex-wrap gap-3">
							{socialLinks.map((socialLink) => (
								<a
									key={socialLink.id}
									href={socialLink.url}
									target="_blank"
									rel="noreferrer"
									aria-label={socialLink.platform.name}
									title={socialLink.platform.name}
									className="inline-flex size-11 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
								>
									<SocialPlatformIcon
										icon={socialLink.platform.icon}
										className="size-5"
									/>
								</a>
							))}
						</div>
					</div>
				)}

				<div className="mt-10 overflow-hidden rounded-lg border bg-muted/30">
					{mapEmbedUrl?.includes("/maps/embed") ? (
						<iframe
							src={mapEmbedUrl}
							title={isArabic ? "موقعنا على الخريطة" : "Our location on the map"}
							loading="lazy"
							referrerPolicy="no-referrer-when-downgrade"
							className="h-80 w-full border-0 sm:h-96"
						/>
					) : (
						<div className="flex min-h-48 items-center justify-center px-6 text-center text-muted-foreground">
							{isArabic ? "لم تتم إضافة الخريطة بعد" : "Map not provided yet"}
						</div>
					)}
				</div>
				{maps?.google_maps_url && (
					<a
						href={maps.google_maps_url}
						target="_blank"
						rel="noreferrer"
						className="mt-3 inline-block text-sm font-medium underline underline-offset-4"
					>
						{isArabic ? "فتح الموقع في خرائط Google" : "Open in Google Maps"}
					</a>
				)}
			</section>
		</main>
	);
}