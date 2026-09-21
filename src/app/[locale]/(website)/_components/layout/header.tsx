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
};

export default function Header({ locale }: HeaderProps) {
	const isArabic = locale === "ar";
	const links = [
		{ label: isArabic ? "الرئيسية" : "Home", href: `/${locale}` },
		{ label: isArabic ? "خدماتنا" : "Services", href: `/${locale}#services` },
		{ label: isArabic ? "من نحن" : "About us", href: `/${locale}#about` },
		{ label: isArabic ? "تواصل معنا" : "Contact", href: `/${locale}#contact` },
	];

	return (
		<header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
			<div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
				<Link href={`/${locale}`} className="flex items-center gap-2 font-bold">
					<Logo className="size-8" />
					<span>AVORA</span>
				</Link>

				<nav className="hidden items-center gap-1 text-sm md:flex">
					{links.map((link) => (
						<Link
							key={link.label}
							href={link.href}
							className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
						>
							{link.label}
						</Link>
					))}
				</nav>

				<div className="hidden items-center gap-2 md:flex">
					<LanguageSwitcher />
					<ModeToggle />
					<Link
						href={`/${locale}/auth/login`}
						className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
					>
						{isArabic ? "دخول" : "Login"}
					</Link>
					<Link
						href={`/${locale}/auth/register`}
						className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground transition-opacity hover:opacity-90"
					>
						{isArabic ? "إنشاء حساب" : "Get started"}
					</Link>
				</div>

				<div className="flex items-center gap-1 md:hidden">
					<ModeToggle />
					<Sheet>
						<SheetTrigger
							render={
								<Button variant="outline" size="icon" aria-label={isArabic ? "فتح القائمة" : "Open menu"} />
							}
						>
							<Menu className="size-5" />
						</SheetTrigger>
						<SheetContent side={isArabic ? "left" : "right"}>
							<SheetHeader>
								<SheetTitle className="flex items-center gap-2">
									<Logo className="size-7" />
									AVORA
								</SheetTitle>
							</SheetHeader>
							<nav className="flex flex-col gap-1 px-4">
								{links.map((link) => (
									<Link
										key={link.label}
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
										{isArabic ? "اللغة" : "Language"}
									</span>
									<LanguageSwitcher />
								</div>
								<Link
									href={`/${locale}/auth/login`}
									className="rounded-md border px-3 py-2 text-center text-sm transition-colors hover:bg-muted"
								>
									{isArabic ? "تسجيل الدخول" : "Login"}
								</Link>
								<Link
									href={`/${locale}/auth/register`}
									className="rounded-md bg-primary px-3 py-2 text-center text-sm text-primary-foreground transition-opacity hover:opacity-90"
								>
									{isArabic ? "إنشاء حساب" : "Get started"}
								</Link>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}