"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Pencil, PackageOpen, RefreshCw, Trash2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  type Category,
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
} from "@/lib/services/categories-api";

import EditCategoryDialog from "./edit-category-dialog";

const storageUrl = (
  process.env.NEXT_PUBLIC_STORAGE_URL || "http://127.0.0.1:8000/storage"
).replace(/\/+$/, "");

function getImageUrl(image: string): string {
  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  const imagePath = image
    .replace(/^\/+/, "")
    .replace(/^storage\/+/i, "");

  return `${storageUrl}/${imagePath}`;
}

function CategoryImage({
  image,
  name,
  noImageLabel,
}: {
  image: string | null;
  name: string;
  noImageLabel: string;
}) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [image]);

  if (!image || hasError) {
    return (
      <div className="flex size-16 items-center justify-center rounded-md bg-muted px-1 text-center text-xs text-muted-foreground">
        {noImageLabel}
      </div>
    );
  }

  return (
    <div className="size-16 overflow-hidden rounded-md bg-muted">
      <Image
        src={getImageUrl(image)}
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

export default function CategoriesTable() {
  const t = useTranslations("categories.table");
  const locale = useLocale();
  const isArabic = locale.startsWith("ar");

  const { data, isLoading, isError, refetch } = useGetCategoriesQuery();

  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const [categoryToDelete, setCategoryToDelete] =
    useState<Category | null>(null);

  const [categoryToEdit, setCategoryToEdit] =
    useState<Category | null>(null);

  const categories: Category[] = data?.data ?? [];

  function getName(category: Category) {
    return isArabic ? category.name_ar : category.name_en;
  }

  function getDescription(category: Category) {
    return isArabic ? category.description_ar : category.description_en;
  }

  function getCategoryImage(category: Category): string | null {
    return category.gallery_item?.image ?? null;
  }

  async function handleDeleteCategory() {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete.id).unwrap();
      toast.success(t("messages.deleted"));
      setCategoryToDelete(null);
    } catch {
      toast.error(t("messages.deleteFailed"));
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
                  <TableHead className="w-28 text-center">
                    {t("actions")}
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

                {!isLoading && isError && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center">
                      <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <p>{t("loadFailed")}</p>
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

                {!isLoading && !isError && categories.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <PackageOpen className="size-8" />
                        <p className="font-medium text-foreground">
                          {t("emptyTitle")}
                        </p>
                        <p className="text-sm">{t("emptyDescription")}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading &&
                  !isError &&
                  categories.map((category) => {
                    const name = getName(category);
                    const description = getDescription(category);

                    return (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">
                          {category.id}
                        </TableCell>

                        <TableCell>
                          <CategoryImage
                            image={getCategoryImage(category)}
                            name={name}
                            noImageLabel={t("noImage")}
                          />
                        </TableCell>

                        <TableCell>
                          <div className="flex min-w-0 flex-col gap-1">
                            <span className="truncate font-medium">
                              {category.name_en}
                            </span>
                            <span
                              dir="rtl"
                              className="truncate text-sm text-muted-foreground"
                            >
                              {category.name_ar}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex max-w-[350px] flex-col gap-1">
                            <p className="truncate text-sm">
                              {description || t("noDescription")}
                            </p>
                            {isArabic && category.description_en && (
                              <p className="truncate text-xs text-muted-foreground">
                                {category.description_en}
                              </p>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <span className="truncate font-mono text-sm">
                            {category.slug}
                          </span>
                        </TableCell>

                        <TableCell className="text-center">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                              onClick={() => setCategoryToEdit(category)}
                              disabled={isDeleting}
                            >
                              <Pencil className="size-4" />
                              <span className="sr-only">
                                {t("editCategory")}
                              </span>
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => setCategoryToDelete(category)}
                              disabled={isDeleting}
                            >
                              <Trash2 className="size-4" />
                              <span className="sr-only">
                                {t("deleteCategory")}
                              </span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {categoryToEdit && (
        <EditCategoryDialog
          category={categoryToEdit}
          open
          onOpenChange={(open: boolean) => {
            if (!open) setCategoryToEdit(null);
          }}
        />
      )}

      <AlertDialog
        open={categoryToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setCategoryToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteDialog.description", {
                name: categoryToDelete ? getName(categoryToDelete) : "",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t("deleteDialog.cancel")}
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDeleteCategory}
              disabled={isDeleting}
            >
              {isDeleting
                ? t("deleteDialog.deleting")
                : t("deleteDialog.confirm")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
