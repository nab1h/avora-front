"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import Logo from "@/assets/svg/logo";
import ModeToggle from "@/components/layout/ModeToggle";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

export default function Header() {
	const links = [
		{  label: "Home", href: "/" },
		{ label: "Services", href: "/services"},
		{ label: "About us", href: "/about" },
		{ label: "Contact", href: "/contact" },
	];

	return (
		<header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
			<div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
				<Link href="/" className="flex items-center gap-2 font-bold">
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
					<ModeToggle />
					<Link
						href="/auth/login"
						className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
					>
						Login
					</Link>
					<Link
						href="/auth/register"
						className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground transition-opacity hover:opacity-90"
					>
						Get started
					</Link>
				</div>

				<div className="flex items-center gap-1 md:hidden">
					<ModeToggle />
					<Sheet>
						<SheetTrigger
							render={
								<Button variant="outline" size="icon" aria-label="Open menu" />
							}
						>
							<Menu className="size-5" />
						</SheetTrigger>
						<SheetContent>
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
										Language
									</span>
								</div>
								<Link
									href="/auth/login"
									className="rounded-md border px-3 py-2 text-center text-sm transition-colors hover:bg-muted"
								>
									Login
								</Link>
								<Link
									href="/auth/register"
									className="rounded-md bg-primary px-3 py-2 text-center text-sm text-primary-foreground transition-opacity hover:opacity-90"
								>
									Get started
								</Link>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}