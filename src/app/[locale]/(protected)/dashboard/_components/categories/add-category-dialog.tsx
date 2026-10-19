"use client";

import { useMemo } from "react";
import { Check, ImageOff, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

import {
  useCreateCategoryMutation,
  useGetGalleryImagesQuery,
} from "@/lib/services/categories-api";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api"
).replace(/\/+$/, "");

function getGalleryImageUrl(image: string): string {
  if (/^https?:\/\//i.test(image)) return image;

  const serverUrl = API_URL.replace(/\/api$/, "");
  const imagePath = image.replace(/^\/+/, "");

  if (imagePath.startsWith("storage/")) {
    return `${serverUrl}/${imagePath}`;
  }

  return `${serverUrl}/storage/${imagePath}`;
}

export default function AddCategoryDialog({ open, setOpen }: Props) {
  const t = useTranslations("categories.dialog");
  const locale = useLocale();
  const isArabic = locale.startsWith("ar");

  const categorySchema = z.object({
    name_ar: z.string().trim().min(1, t("validation.nameArabicRequired")).max(255, t("validation.nameMax")),
    name_en: z.string().trim().min(1, t("validation.nameEnglishRequired")).max(255, t("validation.nameMax")),
    slug: z
      .string()
      .trim()
      .min(1, t("validation.slugRequired"))
      .max(255, t("validation.slugMax"))
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, t("validation.slugFormat")),
    description_ar: z.string().max(10000, t("validation.descriptionMax")).optional(),
    description_en: z.string().max(10000, t("validation.descriptionMax")).optional(),
    status: z.enum(["active", "inactive"]),
    sort_order: z.coerce.number().int().min(0).max(4294967295),
    gallery_item_id: z.string().optional(),
  });

  type CategoryFormInput = z.input<typeof categorySchema>;
  type CategoryFormValues = z.output<typeof categorySchema>;

  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const {
    data: galleryImages = [],
    isLoading: isLoadingImages,
    isError: isGalleryError,
  } = useGetGalleryImagesQuery();

  const form = useForm<CategoryFormInput, unknown, CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name_ar: "",
      name_en: "",
      slug: "",
      description_ar: "",
      description_en: "",
      status: "active",
      sort_order: 0,
      gallery_item_id: "",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = form;

  const selectedImageId = watch("gallery_item_id");

  const selectedImage = useMemo(
    () => galleryImages.find((image) => String(image.id) === selectedImageId),
    [galleryImages, selectedImageId],
  );

  async function onSubmit(values: CategoryFormValues) {
    try {
      const imageId = values.gallery_item_id?.trim();

      await createCategory({
        name_ar: values.name_ar,
        name_en: values.name_en,
        slug: values.slug,
        description_ar: values.description_ar?.trim() || null,
        description_en: values.description_en?.trim() || null,
        status: values.status,
        sort_order: values.sort_order,
        gallery_item_id: imageId ? Number(imageId) : null,
      }).unwrap();

      toast.success(t("messages.created"));
      reset();
      setOpen(false);
    } catch (error) {
      console.error("Create category failed:", error);
      toast.error(t("messages.createFailed"));
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (isLoading) return;
    setOpen(nextOpen);
    if (!nextOpen) reset();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        dir={isArabic ? "rtl" : "ltr"}
        className="max-h-[85dvh] overflow-y-auto sm:max-h-[80vh] sm:max-w-[650px]"
      >
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field data-invalid={!!errors.name_ar}>
              <FieldLabel htmlFor="category-name-ar">{t("nameArabic")}</FieldLabel>
              <Input
                id="category-name-ar"
                {...register("name_ar")}
                dir="rtl"
                disabled={isLoading}
                maxLength={255}
              />
              {errors.name_ar && <FieldError errors={[errors.name_ar]} />}
            </Field>

            <Field data-invalid={!!errors.name_en}>
              <FieldLabel htmlFor="category-name-en">{t("nameEnglish")}</FieldLabel>
              <Input
                id="category-name-en"
                {...register("name_en")}
                dir="ltr"
                disabled={isLoading}
                maxLength={255}
              />
              {errors.name_en && <FieldError errors={[errors.name_en]} />}
            </Field>
          </div>

          <Field data-invalid={!!errors.slug}>
            <FieldLabel htmlFor="category-slug">{t("slug")}</FieldLabel>
            <Input
              id="category-slug"
              {...register("slug")}
              dir="ltr"
              placeholder="indoor-lighting"
              disabled={isLoading}
              maxLength={255}
            />
            {errors.slug && <FieldError errors={[errors.slug]} />}
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field data-invalid={!!errors.description_ar}>
              <FieldLabel htmlFor="category-description-ar">{t("descriptionArabic")}</FieldLabel>
              <Textarea
                id="category-description-ar"
                {...register("description_ar")}
                dir="rtl"
                rows={4}
                className="resize-none"
                disabled={isLoading}
              />
              {errors.description_ar && <FieldError errors={[errors.description_ar]} />}
            </Field>

            <Field data-invalid={!!errors.description_en}>
              <FieldLabel htmlFor="category-description-en">{t("descriptionEnglish")}</FieldLabel>
              <Textarea
                id="category-description-en"
                {...register("description_en")}
                dir="ltr"
                rows={4}
                className="resize-none"
                disabled={isLoading}
              />
              {errors.description_en && <FieldError errors={[errors.description_en]} />}
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field data-invalid={!!errors.status}>
              <FieldLabel htmlFor="category-status">{t("status")}</FieldLabel>
              <select
                id="category-status"
                {...register("status")}
                disabled={isLoading}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="active">{t("active")}</option>
                <option value="inactive">{t("inactive")}</option>
              </select>
              {errors.status && <FieldError errors={[errors.status]} />}
            </Field>

            <Field data-invalid={!!errors.sort_order}>
              <FieldLabel htmlFor="category-sort-order">{t("sortOrder")}</FieldLabel>
              <Input
                id="category-sort-order"
                type="number"
                min={0}
                {...register("sort_order")}
                disabled={isLoading}
              />
              {errors.sort_order && <FieldError errors={[errors.sort_order]} />}
            </Field>
          </div>

          <Field data-invalid={!!errors.gallery_item_id}>
            <FieldLabel>{t("categoryImage")}</FieldLabel>
            <p className="text-sm text-muted-foreground">{t("galleryDescription")}</p>

            {isLoadingImages ? (
              <div className="flex items-center justify-center gap-2 rounded-lg border p-8 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                {t("loadingImages")}
              </div>
            ) : isGalleryError ? (
              <div className="rounded-lg border border-destructive/30 p-4 text-sm text-destructive">
                {t("galleryLoadFailed")}
              </div>
            ) : galleryImages.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-lg border p-8 text-sm text-muted-foreground">
                <ImageOff className="size-8" />
                {t("noImages")}
              </div>
            ) : (
              <div className="grid max-h-72 grid-cols-2 gap-3 overflow-y-auto rounded-lg border p-3 sm:grid-cols-3">
                {galleryImages.map((image) => {
                  const selected = selectedImageId === String(image.id);

                  return (
                    <button
                      key={image.id}
                      type="button"
                      disabled={isLoading}
                      aria-pressed={selected}
                      aria-label={t("selectImage", { id: image.id })}
                      onClick={() =>
                        setValue("gallery_item_id", String(image.id), {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                      className={[
                        "group relative overflow-hidden rounded-lg border-2 text-start transition-all",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        selected
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border hover:border-primary/50",
                      ].join(" ")}
                    >
                      <div className="aspect-square overflow-hidden bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getGalleryImageUrl(image.image)}
                          alt={t("galleryImageAlt", { id: image.id })}
                          loading="lazy"
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-2 p-2">
                        <span className="truncate text-xs text-muted-foreground">#{image.id}</span>
                        {selected && (
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Check className="size-4" />
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {selectedImage && (
              <p className="text-sm text-muted-foreground">
                {t("selectedImage", { id: selectedImage.id })}
              </p>
            )}

            {errors.gallery_item_id && <FieldError errors={[errors.gallery_item_id]} />}

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-fit"
              disabled={isLoading || !selectedImageId}
              onClick={() =>
                setValue("gallery_item_id", "", {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            >
              {t("clearImage")}
            </Button>
          </Field>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  {t("creating")}
                </>
              ) : (
                t("create")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
