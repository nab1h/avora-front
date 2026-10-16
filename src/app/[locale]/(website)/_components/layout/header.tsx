"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import Logo from "@/assets/svg/logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import ModeToggle from "@/components/layout/ModeToggle";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

type HeaderProps = {
	locale: string;
	siteName: string;
	siteLogo: string | null;
};

export default function Header({
	locale,
	siteName,
	siteLogo,
}: HeaderProps) {
	const isArabic = locale === "ar";

	const links = [
		{
			label: isArabic ? "الرئيسية" : "Home",
			href: `/${locale}/`,
		},
		{
			label: isArabic ? "التصنيفات" : "Categories",
			href: `/${locale}/categories`,
		},
		{
			label: isArabic ? "خدماتنا" : "Services",
			href: `/${locale}/services`,
		},
		{
			label: isArabic ? "المنتجات" : "products",
			href: `/${locale}/products`,
		},
		{
			label: isArabic ? "من نحن" : "About us",
			href: `/${locale}/about`,
		},
		{
			label: isArabic ? "تواصل معنا" : "Contact",
			href: `/${locale}/contact`,
		},
	];

	return (
		<header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-xl">
			<div className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between px-5 sm:px-8">
				<Link
					href={`/${locale}`}
					className="flex items-center gap-2 font-bold"
				>
					{siteLogo ? (
						<img
							src={siteLogo}
							alt={siteName}
							className="size-17 object-contain"
						/>
					) : (
						<Logo className="size-8" />
					)}
				</Link>

				<nav className="hidden items-center gap-1 text-sm md:flex">
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="relative rounded-md px-3 py-2 text-muted-foreground transition-colors after:absolute after:inset-x-3 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform hover:text-foreground hover:after:scale-x-100"
						>
							{link.label}
						</Link>
					))}
				</nav>

				<div className="hidden items-center gap-2 md:flex">
					<LanguageSwitcher />
					<ModeToggle />
				</div>

				<div className="flex items-center gap-1 md:hidden">
					<ModeToggle />

					<Sheet>
						<SheetTrigger
							render={
								<Button
									variant="outline"
									size="icon"
									aria-label={
										isArabic
											? "فتح القائمة"
											: "Open menu"
									}
								/>
							}
						>
							<Menu className="size-5" />
						</SheetTrigger>

						<SheetContent side={isArabic ? "left" : "right"}>
							<SheetHeader>
								<SheetTitle className="flex items-center gap-2">
									{siteLogo ? (
										<img
											src={siteLogo}
											alt={siteName}
											className="size-7 object-contain"
										/>
									) : (
										<Logo className="size-7" />
									)}

									{siteName}
								</SheetTitle>
							</SheetHeader>

							<nav className="flex flex-col gap-1 px-4">
								{links.map((link) => (
									<Link
										key={link.href}
										href={link.href}
										className="rounded-md px-3 py-3 text-sm transition-colors hover:bg-muted"
									>
										{link.label}
									</Link>
								))}
							</nav>

							<div className="mt-auto flex flex-col gap-3 border-t p-4">
								<div className="flex items-center justify-between">
									<span className="text-sm text-muted-foreground">
										{isArabic
											? "اللغة"
											: "Language"}
									</span>

									<LanguageSwitcher />
									<ModeToggle />
								</div>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}