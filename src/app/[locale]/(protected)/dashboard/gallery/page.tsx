
"use client";

import { useTranslations } from "next-intl";

import ShowGallery from "../_components/gallery/gallery";

export default function GalleryPage() {
    const t = useTranslations("gallery");

    return (
        <div className="flex w-full flex-col gap-6 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1 text-start">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        {t("title")}
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        {t("description")}
                    </p>
                </div>
            </div>

            <ShowGallery />
        </div>
    );
}

