import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import Logo from "@/assets/svg/logo";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
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
			action: isArabic ? "اتصل بنا" : "Call us",
			icon: Phone,
		},
		{
			label: isArabic ? "البريد الإلكتروني" : "Email address",
			value: contact?.contact_email,
			href: contact?.contact_email ? `mailto:${contact.contact_email}` : undefined,
			action: isArabic ? "راسلنا" : "Email us",
			icon: Mail,
		},
		{
			label: isArabic ? "العنوان" : "Address",
			value: isArabic
				? contact?.contact_address_ar || contact?.contact_address
				: contact?.contact_address,
			href: maps?.google_maps_url || undefined,
			action: isArabic ? "الاتجاهات" : "Directions",
			icon: MapPin,
		},
	];

	return (
		<main>
			<section className="relative overflow-hidden bg-brand-charcoal text-white">
				<div aria-hidden="true" className="pointer-events-none absolute -end-24 -top-24 size-80 rounded-full border border-white/10 sm:size-[28rem]" />
				<div aria-hidden="true" className="pointer-events-none absolute -end-12 -top-12 size-56 rounded-full border border-white/10 sm:size-80" />
				<div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
					<p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-white/70">
						<Logo aria-hidden="true" className="size-5 text-primary" />
						{isArabic ? `تواصل مع ${siteName}` : `Contact ${siteName}`}
					</p>
					<h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-balance sm:text-6xl lg:text-7xl">
						{isArabic ? "يسعدنا تواصلك معنا" : "Get in touch"}<span className="text-primary">.</span>
					</h1>
					<p className="mt-6 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
						{isArabic ? "لديك سؤال أو فكرة لمشروعك؟ تواصل معنا ودعنا نساعدك في اختيار ما يناسب مساحتك." : "Have a question or a project in mind? Let’s help you find the right choice for your space."}
					</p>
				</div>
			</section>

			<section aria-label={isArabic ? "معلومات التواصل" : "Contact details"} className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
				<Reveal className="grid gap-10 lg:grid-cols-12 lg:gap-16">
					<div className="lg:col-span-4">
						<SectionHeading
							index="01"
							eyebrow={isArabic ? "تواصل مباشر" : "Direct contact"}
							title={isArabic ? "كل محادثة بداية" : "Every conversation is a beginning"}
							description={isArabic ? "اختر الطريقة الأنسب لك. نحن هنا للإجابة عن استفساراتك ومناقشة أفكارك." : "Choose the way that works for you. We’re here for your questions and ideas."}
							className="mb-0 sm:mb-0"
						/>
					</div>
					<div className="overflow-hidden rounded-md border bg-card lg:col-span-8">
						{contactItems.map(({ label, value, href, action, icon: Icon }) => {
							const isAddress = Icon === MapPin;
							const details = (
								<>
									<span className="flex size-12 shrink-0 items-center justify-center rounded-full border bg-background text-foreground transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
										<Icon aria-hidden="true" className="size-5" strokeWidth={1.5} />
									</span>
									<div className="min-w-0 flex-1">
										<h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</h3>
										{value ? (
											<p className="mt-2 whitespace-pre-line text-base font-medium leading-7 [overflow-wrap:anywhere] sm:text-xl">
												<bdi dir={isAddress ? "auto" : "ltr"}>{value}</bdi>
											</p>
										) : (
											<p className="mt-2 text-sm text-muted-foreground">{isArabic ? "لم تتم إضافة هذه البيانات بعد" : "Not provided yet"}</p>
										)}
									</div>
									{href && value && (
										<span className="flex shrink-0 items-center gap-2 self-start pt-3 text-xs font-medium sm:self-center sm:pt-0">
											<span className="hidden sm:inline">{action}</span>
											<ArrowUpRight aria-hidden="true" className="size-5 transition-transform group-hover:-translate-y-0.5 rtl:-rotate-90" />
										</span>
									)}
								</>
							);
							const rowClassName = "group flex items-start gap-4 border-b p-5 last:border-b-0 sm:items-center sm:gap-6 sm:p-8";
							return href && value ? (
								<a key={label} href={href} target={isAddress ? "_blank" : undefined} rel={isAddress ? "noreferrer" : undefined} className={`${rowClassName} transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring`}>
									{details}
								</a>
							) : (
								<div key={label} className={rowClassName}>{details}</div>
							);
						})}
					</div>
				</Reveal>
			</section>

			<section className="border-t bg-muted/30">
				<div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:gap-16 lg:px-8">
				<Reveal className="lg:col-span-4">
					<SectionHeading
						index="02"
						eyebrow={isArabic ? "أقرب إليك" : "Find us"}
						title={isArabic ? "لنبقَ على تواصل" : "Let’s stay connected"}
						description={isArabic ? "اعثر على موقعنا على الخريطة، وتابع آخر أخبارنا على منصات التواصل." : "Find our location on the map and follow our latest updates on social media."}
					/>

				{socialLinks.length > 0 && (
					<div className="border-t pt-6">
						<h3 className="text-sm font-medium">
							{isArabic ? "تابعنا على" : "Follow us"}
						</h3>
						<div className="mt-4 flex flex-wrap gap-3">
							{socialLinks.map((socialLink) => (
								<a
									key={socialLink.id}
									href={socialLink.url}
									target="_blank"
									rel="noreferrer"
									aria-label={socialLink.platform.name}
									title={socialLink.platform.name}
									className="inline-flex size-11 items-center justify-center rounded-md border bg-background text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
				</Reveal>
				<Reveal className="min-w-0 lg:col-span-8">

				<div className="overflow-hidden rounded-md border bg-background">
					{mapEmbedUrl?.includes("/maps/embed") ? (
						<iframe
							src={mapEmbedUrl}
							title={isArabic ? "موقعنا على الخريطة" : "Our location on the map"}
							loading="lazy"
							referrerPolicy="no-referrer-when-downgrade"
							className="block h-80 w-full border-0 sm:h-[420px]"
						/>
					) : (
						<div className="flex min-h-80 flex-col items-center justify-center gap-5 px-6 text-center text-muted-foreground sm:min-h-[420px]">
							<span className="flex size-16 items-center justify-center rounded-full bg-muted"><MapPin aria-hidden="true" className="size-6" /></span>
							<p className="text-sm">{isArabic ? "لم تتم إضافة الخريطة بعد" : "Map not provided yet"}</p>
						</div>
					)}
				</div>
				{maps?.google_maps_url && (
					<a
						href={maps.google_maps_url}
						target="_blank"
						rel="noreferrer"
						className="mt-4 inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
					>
						{isArabic ? "فتح الموقع في خرائط Google" : "Open in Google Maps"}
						<ArrowUpRight aria-hidden="true" className="size-4 rtl:-rotate-90" />
					</a>
				)}
				</Reveal>
				</div>
			</section>
		</main>
	);
}
