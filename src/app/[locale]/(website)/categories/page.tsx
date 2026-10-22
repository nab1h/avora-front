
import { CategoryShowcase } from "@/components/site/catalog/category-showcase";
import { getCategories } from "@/lib/catalog/data";
import { getSeo, seoToMetadata } from "@/lib/seo";
import { getPublicContents } from "@/lib/services/public-contents";
import { Metadata } from "next";


type PageProps = {
    params: Promise<{ locale: "ar" | "en" }>;
};


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params;
    const seo = await getSeo("categories", locale);

    return seoToMetadata(seo);
}



export default async function CategoriesPage({ params }: PageProps) {
    const [{ data }, { locale }] = await Promise.all([
        getPublicContents("categories"),
        params,
    ]);
    const contents = data ?? [];
    const categories = await getCategories(locale);


    const getContent = (section: string, key: string) => {
        return contents.find(
            (item) =>
                item.section === section &&
                item.key === key
        );
    };

    // ---------------
    // category showcase
    // ---------------
    const categoryShowcaseTitle = getContent("categories", "title");
    const categoryShowcaseTitleAr = getContent("categories", "title-ar");
    const descriptionShowcaseTitle = getContent("categories", "desc");
    const descriptionShowcaseTitleAr = getContent("categories", "desc-ar");

    const categoryShowcaseDescription = (locale === "ar" ? descriptionShowcaseTitleAr?.value ?? descriptionShowcaseTitle?.value : descriptionShowcaseTitle?.value) ?? undefined;
    const categoryShowcaseTitleValue = (locale === "ar" ? categoryShowcaseTitleAr?.value ?? categoryShowcaseTitle?.value : categoryShowcaseTitle?.value) ?? undefined;
    return (
        <CategoryShowcase categories={categories} categoryShowcaseTitleValue={categoryShowcaseTitleValue} categoryShowcaseDescription={categoryShowcaseDescription} />
    );
}
