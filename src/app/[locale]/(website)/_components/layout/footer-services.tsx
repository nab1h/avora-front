"use client";

import Link from "next/link";
import { useGetServicesQuery } from "@/lib/services/services-api";
import { getServiceDisplay } from "../../services/service-display";

export default function FooterServices({ locale }: { locale: string }) {
	const { data } = useGetServicesQuery();
	const services = [...(data?.data ?? [])]
		.filter((service) => service.is_active)
		.sort((first, second) => first.sort_order - second.sort_order);

	return (
		<div className="mt-3 space-y-2 text-sm leading-6 text-brand-white/65">
			{services.map((service) => {
				const display = getServiceDisplay(service, locale);
				return (
					<Link key={service.id} href={`/${locale}/services/${encodeURIComponent(display.slug)}`} className="block break-words transition-colors hover:text-brand-white">
						{display.name}
					</Link>
				);
			})}
			<Link href={`/${locale}/services`} className="block pt-2 font-medium text-brand-white underline underline-offset-4">
				{locale === "ar" ? "جميع الخدمات" : "All services"}
			</Link>
		</div>
	);
}
