// components/home/final-cta.tsx
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="border-t border-white/10 bg-[hsl(var(--dark))] text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-20 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to light your next project<span className="text-primary">?</span>
          </h2>
          <p className="mt-3 max-w-xl text-sm text-white/60">
            Browse the full catalog or reach out — we are glad to help you specify.
          </p>
        </div>
        <Link
          href="/products"
          className={`${buttonVariants({ size: "lg" })} shrink-0 bg-primary text-primary-foreground hover:bg-primary/90`}
        >
          Browse the Catalog
        </Link>
      </div>
    </section>
  );
}