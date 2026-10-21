"use client";

import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

import { useCreateColorMutation } from "@/lib/services/colors-api";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const HEX_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export default function AddColorDialog({ open, setOpen }: Props) {
  const t = useTranslations("colors.dialog");
  const locale = useLocale();
  const isArabic = locale.startsWith("ar");

  const colorSchema = z.object({
    name_ar: z
      .string()
      .trim()
      .min(1, t("validation.nameArabicRequired"))
      .max(255, t("validation.nameMax")),
    name_en: z
      .string()
      .trim()
      .min(1, t("validation.nameEnglishRequired"))
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

  const [createColor, { isLoading }] = useCreateColorMutation();

  const form = useForm<ColorFormInput, unknown, ColorFormValues>({
    resolver: zodResolver(colorSchema),
    defaultValues: {
      name_ar: "",
      name_en: "",
      hex: "#",
      status: "active",
      sort_order: 0,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = form;

  const hexValue = watch("hex");
  const previewColor = HEX_REGEX.test(hexValue) ? hexValue : "#ffffff";

  async function onSubmit(values: ColorFormValues) {
    try {
      await createColor({
        name_ar: values.name_ar,
        name_en: values.name_en,
        hex: values.hex.toLowerCase(),
        status: values.status,
        sort_order: values.sort_order,
      }).unwrap();

      toast.success(t("messages.created"));
      reset();
      setOpen(false);
    } catch (error) {
      console.error("Create color failed:", error);
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
        className="sm:max-w-[550px]"
      >
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field data-invalid={!!errors.name_ar}>
              <FieldLabel htmlFor="color-name-ar">{t("nameArabic")}</FieldLabel>
              <Input
                id="color-name-ar"
                {...register("name_ar")}
                dir="rtl"
                disabled={isLoading}
                maxLength={255}
              />
              {errors.name_ar && <FieldError errors={[errors.name_ar]} />}
            </Field>

            <Field data-invalid={!!errors.name_en}>
              <FieldLabel htmlFor="color-name-en">{t("nameEnglish")}</FieldLabel>
              <Input
                id="color-name-en"
                {...register("name_en")}
                dir="ltr"
                disabled={isLoading}
                maxLength={255}
              />
              {errors.name_en && <FieldError errors={[errors.name_en]} />}
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field data-invalid={!!errors.hex}>
              <FieldLabel htmlFor="color-hex">{t("hex")}</FieldLabel>
              <div className="flex items-center gap-3">
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-md border shadow-sm"
                  style={{ backgroundColor: previewColor }}
                  aria-hidden="true"
                />
                <Input
                  id="color-hex"
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
              <FieldLabel htmlFor="color-sort-order">{t("sortOrder")}</FieldLabel>
              <Input
                id="color-sort-order"
                type="number"
                min={0}
                {...register("sort_order")}
                disabled={isLoading}
              />
              {errors.sort_order && <FieldError errors={[errors.sort_order]} />}
            </Field>
          </div>

          <Field data-invalid={!!errors.status}>
            <FieldLabel htmlFor="color-status">{t("status")}</FieldLabel>
            <select
              id="color-status"
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
