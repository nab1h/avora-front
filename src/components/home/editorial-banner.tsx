// components/home/editorial-banner.tsx
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { siteImages } from "@/lib/site/images";
import { Link } from "@/i18n/navigation";

export function EditorialBanner() {
    return (
        <section className="relative">
            <div className="relative h-[70svh] min-h-[460px] w-full overflow-hidden">
                <Image
                    src={siteImages.editorial}
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-[hsl(var(--dark))]/70" />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[hsl(var(--dark))] to-transparent" />

                <Reveal className="absolute inset-x-0 bottom-0 z-10">
                    <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
                        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/60">
                            The Collection — 03
                        </p>
                        <h2 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
                            Rooms are remembered by their light.
                        </h2>
                        <Link href="/products" className={buttonVariants({ size: "lg" })}>
                            Explore Products
                        </Link>
                        <Link
                            href="/#categories"
                            className={buttonVariants({
                                variant: "outline",
                                size: "lg",
                                className: "border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white",
                            })}
                        >
                            Discover Our Collection
                        </Link>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}