
"use client";

import { useState } from "react";


import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
    Pencil,
    PackageOpen,
    RefreshCw,
    Trash2,
} from "lucide-react";

import Image from "next/image";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Skeleton } from "@/components/ui/skeleton";

import {
    type Service,
    useDeleteServiceMutation,
    useGetServicesQuery,
} from "@/lib/services/services-api";

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { toast } from "sonner";

import EditServiceDialog from "./edit-service-dialog";
import { useTranslations } from "next-intl";

const storageUrl = (
    process.env.NEXT_PUBLIC_STORAGE_URL ||
    "http://localhost:8000/storage"
).replace(/\/+$/, "");

function getServiceImageUrl(image: string) {
    if (/^https?:\/\//i.test(image)) {
        return image;
    }

    const imagePath = image
        .replace(/^\/+/, "")
        .replace(/^storage\/+/, "");

    return `${storageUrl}/${imagePath}`;
}

function ServiceImage({
    image,
    name,
}: {
    image: string | null;
    name: string;
}) {
    const [hasError, setHasError] = useState(false);

    if (!image || hasError) {
        return (
            <div className="flex size-16 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
                No image
            </div>
        );
    }

    return (
        <div className="size-16 overflow-hidden rounded-md bg-muted">
            <Image
                src={getServiceImageUrl(image)}
                alt={name}
                width={64}
                height={64}
                unoptimized
                onError={() => setHasError(true)}
                className="size-full object-cover"
            />
        </div>
    );
}

export default function ServicesTable() {
    const t = useTranslations("services.table");

    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useGetServicesQuery();

    const [
        deleteService,
        { isLoading: isDeleting },
    ] = useDeleteServiceMutation();

    const [serviceToDelete, setServiceToDelete] =
        useState<Service | null>(null);

    const [serviceToEdit, setServiceToEdit] =
        useState<Service | null>(null);

    const services: Service[] = data?.data ?? [];

    async function handleDeleteService() {
        if (!serviceToDelete) return;

        try {
            await deleteService(
                serviceToDelete.id
            ).unwrap();

            toast.success(
                t("messages.deleted")
            );

            setServiceToDelete(null);
        } catch {
            toast.error(
                t("messages.deleteFailed")
            );
        }
    }

    return (
        <>
            <Card className="overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table className="min-w-[1000px]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-20 text-start">
                                        {t("id")}
                                    </TableHead>

                                    <TableHead className="w-24 text-start">
                                        {t("image")}
                                    </TableHead>

                                    <TableHead className="min-w-[180px] text-start">
                                        {t("name")}
                                    </TableHead>

                                    <TableHead className="min-w-[300px] text-start">
                                        {t("description")}
                                    </TableHead>

                                    <TableHead className="min-w-[180px] text-start">
                                        {t("slug")}
                                    </TableHead>

                                    <TableHead className="w-28 text-center ">
                                        {t("actions")}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {/* Loading */}
                                {isLoading &&
                                    Array.from({
                                        length: 5,
                                    }).map((_, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Skeleton className="h-5 w-10" />
                                            </TableCell>

                                            <TableCell>
                                                <Skeleton className="size-16 rounded-md" />
                                            </TableCell>

                                            <TableCell>
                                                <Skeleton className="h-4 w-32" />
                                            </TableCell>

                                            <TableCell>
                                                <Skeleton className="h-4 w-64" />
                                            </TableCell>

                                            <TableCell>
                                                <Skeleton className="h-4 w-32" />
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex justify-end gap-2">
                                                    <Skeleton className="size-8 rounded-md" />
                                                    <Skeleton className="size-8 rounded-md" />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                {/* Error */}
                                {!isLoading &&
                                    isError && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="h-48 text-center"
                                            >
                                                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                                    <p>
                                                        {t(
                                                            "loadFailed"
                                                        )}
                                                    </p>

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            refetch()
                                                        }
                                                    >
                                                        <RefreshCw className="size-4" />
                                                        {t(
                                                            "tryAgain"
                                                        )}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}

                                {/* Empty */}
                                {!isLoading &&
                                    !isError &&
                                    services.length ===
                                        0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="h-48 text-center"
                                            >
                                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                    <PackageOpen className="size-8" />

                                                    <p className="font-medium text-foreground">
                                                        {t(
                                                            "emptyTitle"
                                                        )}
                                                    </p>

                                                    <p className="text-sm">
                                                        {t(
                                                            "emptyDescription"
                                                        )}
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}

                                {/* Services */}
                                {!isLoading &&
                                    !isError &&
                                    services.map(
                                        (service) => (
                                            <TableRow
                                                key={
                                                    service.id
                                                }
                                            >
                                                {/* ID */}
                                                <TableCell className="font-medium">
                                                    {
                                                        service.id
                                                    }
                                                </TableCell>

                                                {/* Image */}
                                                <TableCell>
                                                    <ServiceImage
                                                        image={
                                                            service.image
                                                        }
                                                        name={
                                                            service.name
                                                        }
                                                    />
                                                </TableCell>

                                                {/* Name */}
                                                <TableCell>
                                                    <span className="font-medium">
                                                        {
                                                            service.name
                                                        }
                                                    </span>
                                                </TableCell>

                                                {/* Description */}
                                                <TableCell>
                                                    <p className="max-w-[350px] truncate text-sm text-muted-foreground">
                                                        {service.description ||
                                                            t(
                                                                "noDescription"
                                                            )}
                                                    </p>
                                                </TableCell>

                                                {/* Slug */}
                                                <TableCell>
                                                    <span className="text-sm text-muted-foreground">
                                                        {
                                                            service.slug
                                                        }
                                                    </span>
                                                </TableCell>

                                                {/* Actions */}
                                                <TableCell className="text-center">
                                                    <div className="flex justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8"
                                                            onClick={() =>
                                                                setServiceToEdit(
                                                                    service
                                                                )
                                                            }
                                                            disabled={
                                                                isDeleting
                                                            }
                                                        >
                                                            <Pencil className="size-4" />

                                                            <span className="sr-only">
                                                                {t(
                                                                    "editService"
                                                                )}
                                                            </span>
                                                        </Button>

                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                            onClick={() =>
                                                                setServiceToDelete(
                                                                    service
                                                                )
                                                            }
                                                            disabled={
                                                                isDeleting
                                                            }
                                                        >
                                                            <Trash2 className="size-4" />

                                                            <span className="sr-only">
                                                                {t(
                                                                    "deleteService"
                                                                )}
                                                            </span>
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <EditServiceDialog
                service={serviceToEdit}
                open={serviceToEdit !== null}
                onOpenChange={(open: boolean) => {
                    if (!open) {
                        setServiceToEdit(null);
                    }
                }}
            />

            {/* Delete Dialog */}
            <AlertDialog
                open={serviceToDelete !== null}
                onOpenChange={(open) => {
                    if (!open && !isDeleting) {
                        setServiceToDelete(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {t("deleteDialog.title")}
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            {t(
                                "deleteDialog.description",
                                {
                                    name:
                                        serviceToDelete?.name ??
                                        "",
                                }
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel
                            disabled={isDeleting}
                        >
                            {t(
                                "deleteDialog.cancel"
                            )}
                        </AlertDialogCancel>

                        <Button
                            variant="destructive"
                            onClick={
                                handleDeleteService
                            }
                            disabled={isDeleting}
                        >
                            {isDeleting
                                ? t(
                                      "deleteDialog.deleting"
                                  )
                                : t(
                                      "deleteDialog.confirm"
                                  )}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}