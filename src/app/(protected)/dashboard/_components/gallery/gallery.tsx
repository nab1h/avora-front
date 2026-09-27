"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
    useBulkDeleteGalleryMutation,
    useCreateGalleryMutation,
    useDeleteGalleryMutation,
    useGetGalleryQuery,
} from "@/lib/services/gallery";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const storageUrl = (
    process.env.NEXT_PUBLIC_STORAGE_URL ||
    "http://localhost:8000/storage"
).replace(/\/+$/, "");

function getGalleryImageUrl(image: string) {
    if (/^https?:\/\//i.test(image)) {
        return image;
    }

    const imagePath = image
        .replace(/^\/+/, "")
        .replace(/^storage\/+/, "");

    return `${storageUrl}/${imagePath}`;
}










export default function ShowGallery() {

    const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);



    // index RTX
    const { data: gallery, isLoading } = useGetGalleryQuery();
    // create RTX
    const [createGallery, { isLoading: isUploading }] = useCreateGalleryMutation();
    // bulkDelete RTX
    const [bulkDeleteGallery, { isLoading: isDeleting }] = useBulkDeleteGalleryMutation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (isLoading) {
        return (
            <Card className="overflow-hidden">
                <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <Skeleton
                                key={index}
                                className="aspect-square rounded-lg"
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(event.target.files || []);

        if (!files.length) {
            return;
        }

        const formData = new FormData();

        files.forEach((file) => {
            formData.append("images[]", file);
        });

        try {
            await createGallery({ formData }).unwrap();

            toast.success("Images uploaded successfully.");
        } catch (error: any) {

            toast.error(
                error?.data?.message ||
                error?.data?.error ||
                "Failed to upload images."
            );

        } finally {
            event.target.value = "";
        }
    };



    // handel selected photos

    const togglePhotoSelection = (id: number) => {
        setSelectedPhotos((prev) =>
            prev.includes(id)
                ? prev.filter((photoId) => photoId !== id)
                : [...prev, id]
        );
    };



    const handleDeleteSelected = async () => {
        if (!selectedPhotos.length) {
            return;
        }

        try {
            await bulkDeleteGallery({
                ids: selectedPhotos,
            }).unwrap();

            toast.success("Images deleted successfully.");

            setSelectedPhotos([]);
        } catch (error: any) {
            toast.error(
                error?.data?.message ||
                error?.data?.error ||
                "Failed to delete images."
            );
        }
    };

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-4">

                {selectedPhotos.length > 0 && (
                    <div className="mb-4 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                            {selectedPhotos.length} selected
                        </span>

                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDeleteSelected}
                        >
                            <Trash2 className="mr-2 size-4" />
                            Delete Selected
                        </Button>
                    </div>
                )}
                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    disabled={isUploading}
                    className="hidden"
                    onChange={handleFileChange}
                />

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {/* Add Photo Card */}
                    <button
                        type="button"
                        disabled={isUploading}
                        onClick={() => fileInputRef.current?.click()}
                        className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
                    >
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Plus className="size-8" />

                            <span className="text-sm font-medium">
                                {isUploading ? "Uploading..." : "Add Photo"}
                            </span>
                        </div>
                    </button>

                    {/* Gallery */}
                    {gallery?.map((photo) => {
                        const isSelected = selectedPhotos.includes(photo.id);

                        return (
                            <div
                                key={photo.id}
                                onClick={() => togglePhotoSelection(photo.id)}
                                className={`group relative aspect-square cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${isSelected
                                        ? "border-primary ring-2 ring-primary/30"
                                        : "border-transparent"
                                    }`}
                            >
                                <img
                                    src={getGalleryImageUrl(photo.image)}
                                    alt="Gallery photo"
                                    className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${isSelected ? "scale-105" : ""
                                        }`}
                                />

                                <div
                                    className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-200 ${isSelected
                                            ? "opacity-100"
                                            : "opacity-0 group-hover:opacity-100"
                                        }`}
                                >
                                    <div
                                        className={`flex size-6 items-center justify-center rounded-full border-2 ${isSelected
                                                ? "border-primary bg-primary"
                                                : "border-white"
                                            }`}
                                    >
                                        {isSelected && (
                                            <span className="text-xs font-bold text-primary-foreground">
                                                ✓
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}