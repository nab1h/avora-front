
"use client";

import Image from "next/image";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
    Pencil,
    RefreshCw,
    Trash2,
    PackageOpen,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
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
    type Product,
    useGetAdminProductsQuery,
    useDeleteProductMutation,
} from "@/lib/services/products-api";
import { getPublicAssetUrl } from "@/lib/services/public-assets";

interface ProductsTableProps {
    onEdit?: (product: Product) => void;
}

export default function ProductsTable({
    onEdit,
}: ProductsTableProps) {
    const t = useTranslations("products.table");
    const locale = useLocale();
    const isArabic = locale.startsWith("ar");

    const [page, setPage] = useState(1);
    const [deletingProduct, setDeletingProduct] =
        useState<Product | null>(null);

    const {
        data,
        isLoading,
        isError,
        isFetching,
        refetch,
    } = useGetAdminProductsQuery({ page });

    const [deleteProduct, { isLoading: isDeleting }] =
        useDeleteProductMutation();

    const products = data?.data ?? [];
    const meta = data?.meta;

    async function handleDelete() {
        if (!deletingProduct) return;

        try {
            await deleteProduct(deletingProduct.id).unwrap();

            toast.success(t("messages.deleted"));
            setDeletingProduct(null);

            // If the deleted item was the last item on this page,
            // move back one page when possible.
            if (
                products.length === 1 &&
                page > 1
            ) {
                setPage((previous) => previous - 1);
            }
        } catch (error) {
            console.error("Delete product failed:", error);
            toast.error(t("messages.deleteFailed"));
        }
    }

    return (
        <div className="space-y-4">
            <Card className="overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table className="min-w-[1120px]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-start">{t("id")}</TableHead>
                                    <TableHead className="text-start">{t("product")}</TableHead>
                                    <TableHead className="text-start">{t("category")}</TableHead>
                                    <TableHead className="text-start">{t("price")}</TableHead>
                                    <TableHead className="text-start">{t("images")}</TableHead>
                                    <TableHead className="text-start">{t("status")}</TableHead>
                                    <TableHead className="text-start">{t("featured")}</TableHead>
                                    <TableHead className="text-center">
                                        {t("actions")}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {isLoading &&
                                    Array.from({ length: 5 }).map(
                                        (_, index) => (
                                            <TableRow key={index}>
                                                {Array.from({ length: 9 }).map(
                                                    (__, cellIndex) => (
                                                        <TableCell key={cellIndex}>
                                                            <Skeleton className="h-5 w-20" />
                                                        </TableCell>
                                                    ),
                                                )}
                                            </TableRow>
                                        ),
                                    )}

                                {!isLoading && isError && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={9}
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
                                    products.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={9}
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
                                    products.map((product) => {
                                        const imageUrl = getPublicAssetUrl(
                                            product.images?.[0]?.url,
                                        );

                                        return (
                                            <TableRow
                                                key={product.id}
                                                className="h-24"
                                            >
                                            <TableCell className="px-4 py-4">
                                                <span className="font-mono text-xs text-muted-foreground">
                                                    #{product.id}
                                                </span>
                                            </TableCell>

                                            <TableCell className="max-w-[280px] px-4 py-4">
                                                <div className="flex min-w-0 flex-col gap-1.5">
                                                    <span className="truncate font-semibold">
                                                        {isArabic
                                                            ? product.name_ar
                                                            : product.name_en}
                                                    </span>

                                                    <span
                                                        className="truncate text-xs text-muted-foreground"
                                                        dir="ltr"
                                                    >
                                                        {product.slug}
                                                    </span>
                                                </div>
                                            </TableCell>

                                            <TableCell className="px-4 py-4">
                                                {product.category
                                                    ? isArabic
                                                        ? product.category.name_ar
                                                        : product.category.name_en
                                                    : "—"}
                                            </TableCell>


                                            <TableCell className="px-4 py-4">
                                                <div className="flex flex-col gap-1.5">
                                                    <span className="font-semibold tabular-nums">
                                                        {product.sale_price ??
                                                            product.price}
                                                    </span>

                                                    {product.sale_price !== null &&
                                                        product.sale_price !== undefined && (
                                                            <span className="text-xs text-muted-foreground line-through">
                                                                {product.price}
                                                            </span>
                                                        )}
                                                </div>
                                            </TableCell>


                                            <TableCell className="px-4 py-4">
                                                <div className="flex items-center gap-2.5">
                                                    {imageUrl ? (
                                                        <Image
                                                            src={imageUrl}
                                                            alt={
                                                                product.images[0].alt_text ||
                                                                (isArabic ? product.name_ar : product.name_en)
                                                            }
                                                            width={64}
                                                            height={64}
                                                            unoptimized
                                                            className="size-16 rounded-xl border object-cover shadow-sm"
                                                        />
                                                    ) : (
                                                        <div className="flex size-16 items-center justify-center rounded-xl border bg-muted text-muted-foreground">
                                                            <PackageOpen className="size-6" />
                                                        </div>
                                                    )}

                                                    {(product.images?.length ?? 0) > 1 && (
                                                        <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                                                            +{product.images.length - 1}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>


                                            <TableCell className="px-4 py-4">
                                                <span
                                                    className={
                                                        product.status === "active"
                                                            ? "inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700"
                                                            : "inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                                                    }
                                                >
                                                    {product.status === "active"
                                                        ? t("active")
                                                        : t("inactive")}
                                                </span>
                                            </TableCell>

                                            <TableCell className="px-4 py-4">
                                                <span className="text-sm text-muted-foreground">
                                                    {product.is_featured
                                                        ? t("yes")
                                                        : t("no")}
                                                </span>
                                            </TableCell>

                                            <TableCell className="px-4 py-4">
                                                <div className="flex justify-center gap-1.5">
                                                    {onEdit && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            aria-label={t("edit")}
                                                            title={t("edit")}
                                                            disabled={isDeleting}
                                                            onClick={() =>
                                                                onEdit(product)
                                                            }
                                                        >
                                                            <Pencil className="size-4" />
                                                        </Button>
                                                    )}

                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:bg-destructive/10"
                                                        aria-label={t("delete")}
                                                        title={t("delete")}
                                                        disabled={isDeleting}
                                                        onClick={() =>
                                                            setDeletingProduct(
                                                                product,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </div>

                    {meta && meta.last_page > 1 && (
                        <div className="flex flex-wrap items-center justify-between gap-3 border-t p-4">
                            <p className="text-sm text-muted-foreground">
                                {t("pagination", {
                                    from: meta.from ?? 0,
                                    to: meta.to ?? 0,
                                    total: meta.total,
                                })}
                            </p>

                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={
                                        page <= 1 || isFetching
                                    }
                                    onClick={() =>
                                        setPage((previous) =>
                                            Math.max(1, previous - 1),
                                        )
                                    }
                                >
                                    {isArabic ? (
                                        <ChevronRight className="size-4" />
                                    ) : (
                                        <ChevronLeft className="size-4" />
                                    )}
                                    {t("previous")}
                                </Button>

                                <span className="text-sm">
                                    {t("page", {
                                        current: meta.current_page,
                                        last: meta.last_page,
                                    })}
                                </span>

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={
                                        page >= meta.last_page ||
                                        isFetching
                                    }
                                    onClick={() =>
                                        setPage((previous) =>
                                            Math.min(
                                                meta.last_page,
                                                previous + 1,
                                            ),
                                        )
                                    }
                                >
                                    {t("next")}
                                    {isArabic ? (
                                        <ChevronLeft className="size-4" />
                                    ) : (
                                        <ChevronRight className="size-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <AlertDialog
                open={deletingProduct !== null}
                onOpenChange={(open) => {
                    if (!open && !isDeleting) {
                        setDeletingProduct(null);
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
                                name: deletingProduct
                                    ? isArabic
                                        ? deletingProduct.name_ar
                                        : deletingProduct.name_en
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
