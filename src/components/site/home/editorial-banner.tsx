// components/home/editorial-banner.tsx
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { Link } from "@/i18n/navigation";
import { getPublicContents } from "@/lib/services/public-contents";
import { getPublicAssetUrl } from "@/lib/services/public-assets";
type PageProps = {
  params: Promise<{ locale: "ar" | "en" }>;
};


export async function EditorialBanner({params}:PageProps) {

    const { locale } = await params;
      const { data } = await getPublicContents("editorial-banner");
      const contents = data ?? [];
    
      const getContent = (section: string, key: string) => {
            return contents.find(
                (item) =>
                    item.section === section &&
                    item.key === key
            );
        };

        const image = getContent('background', 'image');
        const imageUrl = getPublicAssetUrl(image?.gallery?.image || image?.value);
        const text = locale == "ar" ? getContent("text", "desc-ar")?.value : getContent("text", "desc")?.value;
        const buttonPr = locale == "ar" ? getContent("button", "button-pr-ar")?.value : getContent("button", "button-pr")?.value;
        const buttonSc = locale == "ar" ? getContent("button", "button-sc-ar")?.value : getContent("button", "button-sc")?.value;
    return (
        <section className="relative">
            <div className="editorial-motion relative h-[70svh] min-h-[460px] w-full overflow-hidden">
                {imageUrl && (
                    <Reveal image variant="fade-in" duration={1100} className="absolute inset-0">
                    <Image
                        src={imageUrl}
                        alt=""
                        fill
                        sizes="100vw"
                        className="editorial-parallax object-cover"
                    />
                    </Reveal>
                )}
                <div className="absolute inset-0 bg-[hsl(var(--dark))]/70" />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[hsl(var(--dark))] to-transparent" />

                <Reveal className="absolute inset-x-0 bottom-0 z-10">
                    <div className="mx-auto max-w-7xl px-4 pb-26 sm:px-6 lg:px-8">
                        <h2 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
                            {text}
                        </h2>
                        <Link href="/products" className={buttonVariants({ size: "lg" })}>
                            {buttonPr}
                        </Link>
                        <Link
                            href="/#categories"
                            className={buttonVariants({
                                variant: "outline",
                                size: "lg",
                                className: "border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white",
                            })}
                        >
                            {buttonSc}
                        </Link>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
