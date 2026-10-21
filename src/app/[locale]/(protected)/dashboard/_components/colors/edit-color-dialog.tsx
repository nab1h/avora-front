"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
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
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  type Color,
  useEditColorMutation,
} from "@/lib/services/colors-api";

interface Props {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  color: Color | null;
}

const HEX_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getMutationErrorMessage(error: unknown): string | null {
  if (!isRecord(error)) return null;

  const data = isRecord(error.data) ? error.data : null;

  const validationMessages =
    data && isRecord(data.errors)
      ? Object.values(data.errors).flatMap((value) =>
          Array.isArray(value)
            ? value.filter(
                (message): message is string =>
                  typeof message === "string",
              )
            : typeof value === "string"
              ? [value]
              : [],
        )
      : [];

  return (
    validationMessages.join(" ") ||
    (data && typeof data.message === "string" ? data.message : null) ||
    (typeof error.message === "string" ? error.message : null)
  );
}

export default function EditColorDialog({
  open,
  onOpenChange,
  color,
}: Props) {
  const t = useTranslations("colors.dialog");
  const locale = useLocale();
  const isArabic = locale.startsWith("ar");

  const [editColor, { isLoading }] = useEditColorMutation();

  const colorSchema = z.object({
    name_en: z
      .string()
      .trim()
      .min(1, t("validation.nameEnglishRequired"))
      .max(255, t("validation.nameMax")),
    name_ar: z
      .string()
      .trim()
      .min(1, t("validation.nameArabicRequired"))
      .max(255, t("validation.nameMax")),
    hex: z
      .string()
      .trim()
      .min(1, t("validation.hexRequired"))
      .max(7, t("validation.hexMax"))
      .regex(HEX_REGEX, t("validation.hexFormat")),
    status: z.enum(["active", "inactive"]),
    sort_order: z.coerce.number().int().min(0).max(4294967295),
  });

  type ColorFormInput = z.input<typeof colorSchema>;
  type ColorFormValues = z.output<typeof colorSchema>;

  const form = useForm<ColorFormInput, unknown, ColorFormValues>({
    resolver: zodResolver(colorSchema),
    defaultValues: {
      name_en: "",
      name_ar: "",
      hex: "#",
      status: "active",
      sort_order: 0,
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = form;

  const hexValue = watch("hex");
  const previewColor = HEX_REGEX.test(hexValue) ? hexValue : "#ffffff";

  useEffect(() => {
    if (open && color) {
      reset({
        name_en: color.name_en ?? "",
        name_ar: color.name_ar ?? "",
        hex: color.hex ?? "#",
        status: color.status === "inactive" ? "inactive" : "active",
        sort_order: color.sort_order ?? 0,
      });
    }
  }, [open, color, reset]);

  async function onSubmit(values: ColorFormValues) {
    if (!color) return;

    try {
      await editColor({
        id: color.id,
        body: {
          name_en: values.name_en,
          name_ar: values.name_ar,
          hex: values.hex.toLowerCase(),
          status: values.status,
          sort_order: values.sort_order,
        },
      }).unwrap();

      toast.success(t("messages.updated"));
      onOpenChange(false);
    } catch (error: unknown) {
      console.error("Update color failed:", error);

      toast.error(
        getMutationErrorMessage(error) ?? t("messages.updateFailed"),
      );
    }
  }

  function handleDialogChange(nextOpen: boolean) {
    if (isLoading) return;

    onOpenChange(nextOpen);

    if (!nextOpen) reset();
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent
        dir={isArabic ? "rtl" : "ltr"}
        className="sm:max-w-[550px]"
      >
        <DialogHeader>
          <DialogTitle>{t("editTitle")}</DialogTitle>
          <DialogDescription>
            {t("editDescription", {
              name: isArabic
                ? color?.name_ar ?? ""
                : color?.name_en ?? "",
            })}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field data-invalid={!!errors.name_en}>
              <FieldLabel htmlFor="edit-color-name-en">
                {t("nameEnglish")}
              </FieldLabel>
              <Input
                id="edit-color-name-en"
                {...register("name_en")}
                disabled={isLoading}
                maxLength={255}
                dir="ltr"
              />
              {errors.name_en && <FieldError errors={[errors.name_en]} />}
            </Field>

            <Field data-invalid={!!errors.name_ar}>
              <FieldLabel htmlFor="edit-color-name-ar">
                {t("nameArabic")}
              </FieldLabel>
              <Input
                id="edit-color-name-ar"
                {...register("name_ar")}
                dir="rtl"
                disabled={isLoading}
                maxLength={255}
              />
              {errors.name_ar && <FieldError errors={[errors.name_ar]} />}
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field data-invalid={!!errors.hex}>
              <FieldLabel htmlFor="edit-color-hex">{t("hex")}</FieldLabel>
              <div className="flex items-center gap-3">
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-md border shadow-sm"
                  style={{ backgroundColor: previewColor }}
                  aria-hidden="true"
                />
                <Input
                  id="edit-color-hex"
                  {...register("hex")}
                  dir="ltr"
                  placeholder="#C6A04A"
                  disabled={isLoading}
                  maxLength={7}
                  className="flex-1 font-mono"
                />
              </div>
              {errors.hex && <FieldError errors={[errors.hex]} />}
            </Field>

            <Field data-invalid={!!errors.sort_order}>
              <FieldLabel htmlFor="edit-color-sort-order">
                {t("sortOrder")}
              </FieldLabel>
              <Input
                id="edit-color-sort-order"
                type="number"
                min={0}
                {...register("sort_order")}
                disabled={isLoading}
              />
              {errors.sort_order && (
                <FieldError errors={[errors.sort_order]} />
              )}
            </Field>
          </div>

          <Field data-invalid={!!errors.status}>
            <FieldLabel htmlFor="edit-color-status">{t("status")}</FieldLabel>
            <select
              id="edit-color-status"
              {...register("status")}
              disabled={isLoading}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="active">{t("active")}</option>
              <option value="inactive">{t("inactive")}</option>
            </select>
            {errors.status && <FieldError errors={[errors.status]} />}
          </Field>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDialogChange(false)}
              disabled={isLoading}
            >
              {t("cancel")}
            </Button>

            <Button type="submit" disabled={isLoading || !color}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  {t("saving")}
                </>
              ) : (
                t("saveChanges")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
