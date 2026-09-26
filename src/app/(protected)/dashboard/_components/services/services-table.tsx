"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon, PackageOpen, RefreshCw } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { type Service, useDeleteServiceMutation, useGetServicesQuery } from "@/lib/services/services-api";
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

const storageUrl = (
    process.env.NEXT_PUBLIC_STORAGE_URL || "http://localhost:8000/storage"
).replace(/\/+$/, "");

function getServiceImageUrl(image: string) {
    if (/^https?:\/\//i.test(image)) {
        return image;
    }

    const imagePath = image.replace(/^\/+/, "").replace(/^storage\//, "");
    return `${storageUrl}/${imagePath}`;
}

function ServiceImage({ image, name }: { image: string | null; name: string }) {
    const [hasError, setHasError] = useState(false);

    if (!image || hasError) {
        return (
            <div className="flex size-12 items-center justify-center rounded-md bg-muted text-[10px] text-muted-foreground">
                No image
            </div>
        );
    }

    return (
        <div className="size-12 overflow-hidden rounded-md bg-muted">
            <Image
                src={getServiceImageUrl(image)}
                alt={name}
                width={48}
                height={48}
                unoptimized
                onError={() => setHasError(true)}
                className="size-full object-cover"
            />
        </div>
    );
}


export default function ServicesTable() {

    const { data, isLoading, isError, refetch } = useGetServicesQuery();
    const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();
    const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
    const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);



    const services: Service[] = data?.data ?? [];

    async function handleDeleteService() {
        if (!serviceToDelete) return;

        try {
            await deleteService(serviceToDelete.id).unwrap();
            toast.success("Service deleted successfully.");
            setServiceToDelete(null);
        } catch {
            toast.error("Failed to delete service. Please try again.");
        }
    }


    return (
        <>
            <Card className="overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table className="min-w-[640px]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-20">ID</TableHead>
                                    <TableHead className="w-20">Image</TableHead>
                                    <TableHead>Service</TableHead>
                                    <TableHead className="w-20 text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading &&
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <TableRow key={index}>

                                            <TableCell>
                                                <Skeleton className="h-5 w-10" />
                                            </TableCell>

                                            <TableCell>
                                                <Skeleton className="size-12 rounded-md" />
                                            </TableCell>

                                            <TableCell>
                                                <div className="space-y-2">
                                                    <Skeleton className="h-4 w-40" />
                                                    <Skeleton className="h-3 w-24" />
                                                </div>
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <Skeleton className="h-8 w-8 ml-auto rounded-md" />
                                            </TableCell>

                                        </TableRow>
                                    ))
                                }
                                {!isLoading && isError && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-48 text-center">
                                            <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                                <p>Services could not be loaded.</p>
                                                <Button variant="outline" size="sm" onClick={() => refetch()}>
                                                    <RefreshCw className="size-4" />
                                                    Try again
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                                {!isLoading && !isError && services.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-48 text-center">
                                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                <PackageOpen className="size-8" />
                                                <p className="font-medium text-foreground">No services yet</p>
                                                <p className="text-sm">Add a service to see it listed here.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                                {!isLoading && !isError && services.map((service) => (

                                    <TableRow key={service.id}>
                                        <TableCell className="font-medium">
                                            {service.id}
                                        </TableCell>

                                        <TableCell>
                                            <ServiceImage image={service.image} name={service.name} />
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {service.name}
                                                </span>

                                                <span className="text-sm text-muted-foreground">
                                                    {service.slug}
                                                </span>

                                                <span className="max-w-xl truncate text-sm text-muted-foreground">
                                                    {service.description || "No description provided"}
                                                </span>
                                            </div>
                                        </TableCell>

                                        <TableCell className="text-right">

                                            <DropdownMenu>
                                                <DropdownMenuTrigger
                                                    render={
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8"
                                                        >
                                                            <MoreHorizontalIcon />
                                                            <span className="sr-only">
                                                                Open menu
                                                            </span>
                                                        </Button>
                                                    }
                                                />
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => setServiceToEdit(service)}
                                                    >
                                                        Edit
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        variant="destructive"
                                                        onClick={() => setServiceToDelete(service)}
                                                    >
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <EditServiceDialog
                service={serviceToEdit}
                open={serviceToEdit !== null}
                onOpenChange={(open: boolean) => {
                    if (!open) {
                        setServiceToEdit(null);
                    }
                }}
            />
            <AlertDialog
                open={serviceToDelete !== null}
                onOpenChange={(open) => {
                    if (!open && !isDeleting) setServiceToDelete(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete service?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete {serviceToDelete?.name}? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteService}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete service"}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}