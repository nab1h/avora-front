import Link from "next/link";
import { siteConfig } from "@/lib/site/config";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} — home`}
      className={cn("flex items-center gap-2.5", className)}
    >
      {/* Typographic mark until the real logo asset exists */}
      <span aria-hidden="true" className="block size-3.5 bg-primary" />
      <span className="text-sm font-semibold uppercase tracking-[0.18em]">
        {siteConfig.name}
      </span>
    </Link>
  );
}