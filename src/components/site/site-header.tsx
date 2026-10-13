"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, ShoppingCart } from "lucide-react";

import { siteConfig, siteNav } from "@/lib/site/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Logo } from "@/components/site/logo";
import { cn } from "@/lib/utils";

const navLinkClass =
  "relative text-sm opacity-80 transition-opacity hover:opacity-100 " +
  "after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full " +
  "after:origin-right after:scale-x-0 after:bg-current after:transition-transform " +
  "after:duration-300 hover:after:origin-left hover:after:scale-x-100";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Transparent, inverted header over the dark home hero; solid everywhere else.
  const overlay = pathname === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = query.trim();
    setSearchOpen(false);
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  }

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          overlay
            ? "text-white"
            : "border-b bg-background/85 text-foreground backdrop-blur-md"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <Logo />

          <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
            {siteNav.map((link) => (
              <Link key={link.href} href={link.href} className={navLinkClass}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search products"
              onClick={() => setSearchOpen(true)}
              className={cn(overlay && "hover:bg-white/10 hover:text-white")}
            >
              <Search className="size-4" aria-hidden="true" />
            </Button>

            {siteConfig.features.cart && (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Shopping cart"
                className={cn(overlay && "hover:bg-white/10 hover:text-white")}
              >
                <ShoppingCart className="size-4" aria-hidden="true" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className={cn("md:hidden", overlay && "hover:bg-white/10 hover:text-white")}
            >
              <Menu className="size-5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </header>

      {/* Controlled Dialog/Sheet — no `asChild`, safe on Radix and Base UI builds */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogTitle className="sr-only">Search products</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Search the catalog by name or SKU.
          </DialogDescription>
          <form onSubmit={submitSearch} className="mt-2 flex gap-2">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products…"
              autoFocus
            />
            <Button type="submit">Search</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="right" className="w-80">
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>
          <nav aria-label="Mobile" className="mt-10 flex flex-col">
            {siteNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-3.5 text-base transition-colors hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}