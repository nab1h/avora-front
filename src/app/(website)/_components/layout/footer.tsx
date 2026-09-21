import Link from "next/link";
import Logo from "@/assets/svg/logo";


const linkClass = "text-sm text-background/65 transition-colors hover:text-background";

export default function Footer() {
	const footer =
	{
		about: "AVORA helps you manage your work and team from one place.",
		services: "Services",
		serviceLinks: ["Team management", "Project management", "Reports", "Security"],
		sections: "Sections",
		sectionLinks: ["Home", "About us", "Pricing", "Contact us"],
		branches: "Branches",
		branchLinks: ["Cairo", "Riyadh", "Dubai", "London"],
		newsletter: "Newsletter",
		newsletterText: "Get the latest news and updates in your inbox.",
		placeholder: "Your email address",
		subscribe: "Subscribe",
	};

	return (
		<footer className="bg-foreground text-background">
			<div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:py-16">
				<div className="grid gap-12 lg:grid-cols-[1.3fr_2fr_1.3fr]">
					<div className="max-w-xs">
						<Link href="/" className="flex items-center gap-3 font-bold">
							<Logo className="size-10" />
							<span className="text-lg tracking-wide">AVORA</span>
						</Link>
						<p className="mt-5 text-sm leading-7 text-background/65">{footer.about}</p>
					</div>

					<div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
						<FooterColumn title={footer.services} links={footer.serviceLinks} />
						<FooterColumn title={footer.sections} links={footer.sectionLinks} />
						<FooterColumn title={footer.branches} links={footer.branchLinks} />
					</div>

					<div>
						<h2 className="font-semibold">{footer.newsletter}</h2>
						<p className="mt-3 text-sm leading-6 text-background/65">{footer.newsletterText}</p>
						<div className="mt-5 flex rounded-md border border-background/20 bg-background/5 p-1">
							<input
								type="email"
								placeholder={footer.placeholder}
								aria-label={footer.placeholder}
								className="min-w-0 flex-1 bg-transparent px-2 text-sm text-background outline-none placeholder:text-background/45"
							/>
							<button
								type="button"
								className="rounded bg-background px-3 py-2 text-xs font-semibold text-foreground transition-opacity hover:opacity-90"
							>
								{footer.subscribe}
							</button>
						</div>
					</div>
				</div>

				<div className="mt-14 flex flex-col gap-3 border-t border-background/15 pt-6 text-xs text-background/50 sm:flex-row sm:items-center sm:justify-between">
					<span>© {new Date().getFullYear()} AVORA</span>
					<span>All rights reserved</span>
				</div>
			</div>
		</footer>
	);
}

function FooterColumn({
	title,
	links,
	locale,
}: {
	title: string;
	links: string[];
	locale?: string;
}) {
	return (
		<div>
			<h2 className="font-semibold">{title}</h2>
			<ul className="mt-4 space-y-3">
				{links.map((link) => (
					<li key={link}>
						<Link href={locale ? `/${locale}` : "#"} className={linkClass}>
							{link}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}