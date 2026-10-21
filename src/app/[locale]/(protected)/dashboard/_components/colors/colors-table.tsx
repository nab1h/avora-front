"use client";

import { useState } from "react";
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
  type Color,
  useGetColorsQuery,
  useDeleteColorMutation,
} from "@/lib/services/colors-api";

import EditColorDialog from "./edit-color-dialog";

export default function ColorsTable() {
  const t = useTranslations("colors.table");
  const locale = useLocale();
  const isArabic = locale.startsWith("ar");

  const { data, isLoading, isError, refetch } = useGetColorsQuery();

  const [deleteColor, { isLoading: isDeleting }] =
    useDeleteColorMutation();

  const [colorToDelete, setColorToDelete] = useState<Color | null>(null);
  const [colorToEdit, setColorToEdit] = useState<Color | null>(null);

  const colors: Color[] = data?.data ?? [];

  function getName(color: Color) {
    return isArabic ? color.name_ar : color.name_en;
  }

  async function handleDeleteColor() {
    if (!colorToDelete) return;

    try {
      await deleteColor(colorToDelete.id).unwrap();
      toast.success(t("messages.deleted"));
      setColorToDelete(null);
    } catch {
      toast.error(t("messages.deleteFailed"));
    }
  }

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-[720px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20 text-start">{t("id")}</TableHead>
                  <TableHead className="w-24 text-start">{t("color")}</TableHead>
                  <TableHead className="min-w-[180px] text-start">{t("name")}</TableHead>
                  <TableHead className="min-w-[140px] text-start">{t("hex")}</TableHead>
                  <TableHead className="w-28 text-center">{t("status")}</TableHead>
                  <TableHead className="w-28 text-center">{t("actions")}</TableHead>
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
                        <Skeleton className="size-10 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-16 rounded-full" />
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

                {!isLoading && !isError && colors.length === 0 && (
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
                  colors.map((color) => {
                    const name = getName(color);

                    return (
                      <TableRow key={color.id}>
                        <TableCell className="font-medium">
                          {color.id}
                        </TableCell>

                        <TableCell>
                          <span
                            className="flex size-10 shrink-0 items-center justify-center rounded-full border shadow-sm"
                            style={{ backgroundColor: color.hex }}
                            aria-hidden="true"
                          />
                        </TableCell>

                        <TableCell>
                          <div className="flex min-w-0 flex-col gap-1">
                            <span className="truncate font-medium">
                              {color.name_en}
                            </span>
                            <span
                              dir="rtl"
                              className="truncate text-sm text-muted-foreground"
                            >
                              {color.name_ar}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <span className="truncate font-mono text-sm uppercase">
                            {color.hex}
                          </span>
                        </TableCell>

                        <TableCell className="text-center">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              color.status === "active"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {color.status === "active"
                              ? t("active")
                              : t("inactive")}
                          </span>
                        </TableCell>

                        <TableCell className="text-center">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                              onClick={() => setColorToEdit(color)}
                              disabled={isDeleting}
                            >
                              <Pencil className="size-4" />
                              <span className="sr-only">{t("editColor")}</span>
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => setColorToDelete(color)}
                              disabled={isDeleting}
                            >
                              <Trash2 className="size-4" />
                              <span className="sr-only">{t("deleteColor")}</span>
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

      {colorToEdit && (
        <EditColorDialog
          color={colorToEdit}
          open
          onOpenChange={(open: boolean) => {
            if (!open) setColorToEdit(null);
          }}
        />
      )}

      <AlertDialog
        open={colorToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setColorToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteDialog.description", {
                name: colorToDelete ? getName(colorToDelete) : "",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t("deleteDialog.cancel")}
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDeleteColor}
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
