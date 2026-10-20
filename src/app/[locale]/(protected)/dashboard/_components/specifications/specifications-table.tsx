
"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Pencil, RefreshCw, Trash2, PackageOpen } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
    type Specification,
    useGetSpecificationsQuery,
    useDeleteSpecificationMutation,
} from "@/lib/services/specifications-api";

import EditSpecificationDialog from "./edit-specification-dialog";

export default function SpecificationsTable() {
    const t = useTranslations("specifications.table");
    const locale = useLocale();
    const isArabic = locale.startsWith("ar");

    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useGetSpecificationsQuery();

    const [deleteSpecification, { isLoading: isDeleting }] =
        useDeleteSpecificationMutation();

    const [editingSpecification, setEditingSpecification] =
        useState<Specification | null>(null);

    const [isEditOpen, setIsEditOpen] = useState(false);

    const [deletingSpecification, setDeletingSpecification] =
        useState<Specification | null>(null);

    const specifications = data?.data ?? [];

    async function handleDelete() {
        if (!deletingSpecification) return;

        try {
            await deleteSpecification(deletingSpecification.id).unwrap();

            toast.success(t("messages.deleted"));
            setDeletingSpecification(null);
        } catch (error) {
            console.error("Delete specification failed:", error);
            toast.error(t("messages.deleteFailed"));
        }
    }

    function openEdit(specification: Specification) {
        setEditingSpecification(specification);
        setIsEditOpen(true);
    }

    return (
        <div className="space-y-4">
            <Card className="overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table className="min-w-[850px]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-start">{t("id")}</TableHead>
                                    <TableHead className="text-start">{t("key")}</TableHead>
                                    <TableHead className="text-start">{t("nameArabic")}</TableHead>
                                    <TableHead className="text-start">{t("nameEnglish")}</TableHead>
                                    <TableHead className="text-start">{t("unit")}</TableHead>
                                    <TableHead className="text-start">{t("sortOrder")}</TableHead>
                                    <TableHead className="text-start">{t("status")}</TableHead>
                                    <TableHead className="text-center">
                                        {t("actions")}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {isLoading &&
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <TableRow key={index}>
                                            {Array.from({ length: 8 }).map(
                                                (__, cellIndex) => (
                                                    <TableCell key={cellIndex}>
                                                        <Skeleton className="h-5 w-20" />
                                                    </TableCell>
                                                ),
                                            )}
                                        </TableRow>
                                    ))}

                                {!isLoading && isError && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={8}
                                            className="h-40 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-3">
                                                <p className="text-destructive">
                                                    {t("loadFailed")}
                                                </p>

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => refetch()}
                                                >
                                                    <RefreshCw className="size-4" />
                                                    {t("tryAgain")}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}

                                {!isLoading &&
                                    !isError &&
                                    specifications.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={8}
                                                className="h-48 text-center"
                                            >
                                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                    <PackageOpen className="size-8" />

                                                    <p className="font-medium text-foreground">
                                                        {t("emptyTitle")}
                                                    </p>

                                                    <p className="text-sm">
                                                        {t("emptyDescription")}
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}

                                {!isLoading &&
                                    !isError &&
                                    specifications.map((specification) => (
                                        <TableRow key={specification.id}>
                                            <TableCell className="text-start">
                                                {specification.id}
                                            </TableCell>

                                            <TableCell className="text-start">
                                                <code
                                                    
                                                    className="rounded bg-muted px-2 py-1 text-xs"
                                                >
                                                    {specification.spec_key}
                                                </code>
                                            </TableCell>

                                            <TableCell className="text-start">
                                                {specification.name_ar}
                                            </TableCell>

                                            <TableCell className="text-start">
                                                {specification.name_en}
                                            </TableCell>

                                            <TableCell className="text-start">
                                                {specification.unit || t("noUnit")}
                                            </TableCell>

                                            <TableCell className="text-start">
                                                {specification.sort_order}
                                            </TableCell>

                                            <TableCell className="text-start">
                                                <span
                                                    className={
                                                        specification.status === "active"
                                                            ? "rounded-full bg-green-100 px-2 py-1 text-xs text-green-700"
                                                            : "rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground"
                                                    }
                                                >
                                                    {specification.status === "active"
                                                        ? t("active")
                                                        : t("inactive")}
                                                </span>
                                            </TableCell>

                                            <TableCell className="text-start">
                                                <div className="flex justify-center gap-1">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        aria-label={t("editSpecification")}
                                                        title={t("editSpecification")}
                                                        disabled={isDeleting}
                                                        onClick={() =>
                                                            openEdit(specification)
                                                        }
                                                    >
                                                        <Pencil className="size-4" />
                                                    </Button>

                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:bg-destructive/10"
                                                        aria-label={t("deleteSpecification")}
                                                        title={t("deleteSpecification")}
                                                        disabled={isDeleting}
                                                        onClick={() =>
                                                            setDeletingSpecification(
                                                                specification,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <EditSpecificationDialog
                open={isEditOpen}
                setOpen={setIsEditOpen}
                specification={editingSpecification}
            />

            <AlertDialog
                open={deletingSpecification !== null}
                onOpenChange={(open) => {
                    if (!open && !isDeleting) {
                        setDeletingSpecification(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {t("deleteDialog.title")}
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            {t("deleteDialog.description", {
                                name: deletingSpecification
                                    ? isArabic
                                        ? deletingSpecification.name_ar
                                        : deletingSpecification.name_en
                                    : "",
                            })}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                            {t("deleteDialog.cancel")}
                        </AlertDialogCancel>

                        <Button
                            variant="destructive"
                            disabled={isDeleting}
                            onClick={handleDelete}
                        >
                            {isDeleting
                                ? t("deleteDialog.deleting")
                                : t("deleteDialog.confirm")}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
