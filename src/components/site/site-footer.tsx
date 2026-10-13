import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { siteConfig, siteNav } from "@/lib/site/config";
import { getCategories } from "@/lib/catalog/data";
import { Logo } from "@/components/site/logo";

export function SiteFooter() {
  const categories = getCategories();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[hsl(var(--dark))] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo className="text-white" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              {siteConfig.description}
            </p>
          </div>

          <nav aria-label="Footer categories" className="md:col-span-3">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
              Categories
            </p>
            <ul className="mt-4 space-y-2.5">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/products?category=${category.slug}`}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer navigation" className="md:col-span-2">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
              Navigate
            </p>
            <ul className="mt-4 space-y-2.5">
              {siteNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-2">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
              Contact
            </p>
            <ul className="mt-4 space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {siteConfig.contact.address}
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {siteConfig.contact.phone}
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {siteConfig.contact.email}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          {/* Social links render only when real URLs are configured */}
          {siteConfig.social.length > 0 && (
            <ul className="flex gap-5">
              {siteConfig.social.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}