"use client";


import { Button } from "@/components/ui/button";
import { useGetGalleryQuery } from "@/lib/services/gallery";
import { Plus } from "lucide-react";
import ShowGallery from "../_components/gallery/gallery";

export default function ServicesPage() {
    const { data: gallery, isLoading } = useGetGalleryQuery();
    console.log(gallery);
    return (
        <div className="flex w-full flex-col gap-6 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1 text-start">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Gallery
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your Gallary.
                    </p>
                </div>
            </div>

            <ShowGallery />
        </div>
    );
}