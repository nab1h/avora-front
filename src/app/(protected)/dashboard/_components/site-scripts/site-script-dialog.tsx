"use client";

import { useEffect, useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  type SiteScript,
  type SiteScriptPayload,
  type SiteScriptPlacement,
  type SiteScriptStrategy,
  type SiteScriptType,
  useCreateSiteScriptMutation,
  useUpdateSiteScriptMutation,
} from "@/lib/services/site-scripts-api";

const scriptTypeOptions: SiteScriptType[] = ["analytics", "pixel", "verification", "custom"];
const placementOptions: SiteScriptPlacement[] = ["head", "body_start", "body_end"];
const strategyOptions: SiteScriptStrategy[] = ["beforeInteractive", "afterInteractive", "lazyOnload"];

type SiteScriptFormValues = {
  name: string;
  type: SiteScriptType;
  url: string;
  code: string;
  placement: SiteScriptPlacement;
  strategy: SiteScriptStrategy;
  is_active: boolean;
  sort_order: number;
};

const getDefaultValues = (): SiteScriptFormValues => ({
  name: "",
  type: "analytics",
  url: "",
  code: "",
  placement: "head",
  strategy: "afterInteractive",
  is_active: true,
  sort_order: 0,
});

interface SiteScriptDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  mode: "create" | "edit";
  script?: SiteScript | null;
}

export default function SiteScriptDialog({
  open,
  onOpenChange,
  mode,
  script,
}: SiteScriptDialogProps) {
  const t = useTranslations("siteScripts.dialog");
  const [createSiteScript, { isLoading: isCreating }] = useCreateSiteScriptMutation();
  const [updateSiteScript, { isLoading: isUpdating }] = useUpdateSiteScriptMutation();
  const isSubmitting = isCreating || isUpdating;
  const siteScriptSchema = useMemo(
    () =>
      z
        .object({
          name: z.string().trim().min(1, t("validation.nameRequired")).max(255, t("validation.nameTooLong")),
          type: z.enum(["analytics", "pixel", "verification", "custom"]),
          url: z.string().default(""),
          code: z.string().default(""),
          placement: z.enum(["head", "body_start", "body_end"]),
          strategy: z.enum(["beforeInteractive", "afterInteractive", "lazyOnload"]),
          is_active: z.boolean(),
          sort_order: z.number().int().min(0, t("validation.sortOrder")),
        })
        .superRefine((values, ctx) => {
          const hasUrl = Boolean(values.url.trim());
          const hasCode = Boolean(values.code.trim());

          if (!hasUrl && !hasCode) {
            ctx.addIssue({
              code: "custom",
              path: ["url"],
              message: t("validation.urlOrCodeRequired"),
            });
            ctx.addIssue({
              code: "custom",
              path: ["code"],
              message: t("validation.urlOrCodeRequired"),
            });
          }

          if (values.url.trim() && !/^https?:\/\//i.test(values.url.trim())) {
            ctx.addIssue({
              code: "custom",
              path: ["url"],
              message: t("validation.invalidUrl"),
            });
          }
        }),
    [t],
  );

  const form = useForm<SiteScriptFormValues>({
    resolver: zodResolver(siteScriptSchema as any) as any,
    defaultValues: getDefaultValues(),
  });

  const formTitle = mode === "create" ? t("addTitle") : t("editTitle");
  const formDescription =
    mode === "create"
      ? t("createDescription")
      : t("editDescription", { name: script?.name ?? t("thisScript") });

  const submitLabel = useMemo(() => {
    if (mode === "create") {
      return isSubmitting ? t("submit.creating") : t("submit.create");
    }

    return isSubmitting ? t("submit.saving") : t("submit.save");
  }, [isSubmitting, mode, t]);

  useEffect(() => {
    if (!open) {
      form.reset(getDefaultValues());
      return;
    }

    if (mode === "edit" && script) {
      form.reset({
        name: script.name,
        type: script.type,
        url: script.url ?? "",
        code: script.code ?? "",
        placement: script.placement,
        strategy: script.strategy,
        is_active: script.is_active,
        sort_order: script.sort_order,
      });
    } else {
      form.reset(getDefaultValues());
    }
  }, [form, mode, open, script]);

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      form.reset(getDefaultValues());
    }

    onOpenChange(nextOpen);
  };

  const handleSubmit = async (values: SiteScriptFormValues) => {
    const payload: SiteScriptPayload = {
      name: values.name.trim(),
      type: values.type,
      url: values.url?.trim() || null,
      code: values.code?.trim() || null,
      placement: values.placement,
      strategy: values.strategy,
      is_active: values.is_active,
      sort_order: Number(values.sort_order),
    };

    try {
      if (mode === "create") {
        await createSiteScript(payload).unwrap();
        toast.success(t("messages.created"));
      } else if (script) {
        await updateSiteScript({ id: script.id, data: payload }).unwrap();
        toast.success(t("messages.updated"));
      }

      handleClose(false);
    } catch (error: unknown) {
      const validationErrors = (error as { data?: { errors?: Record<string, string[] | string> } })?.data?.errors ?? {};

      if (Object.keys(validationErrors).length) {
        Object.entries(validationErrors).forEach(([field, messages]) => {
          const normalizedMessages = Array.isArray(messages) ? messages : [messages];
          const message = normalizedMessages[0] ?? t("validation.fixFields");
          form.setError(field as keyof SiteScriptFormValues, {
            type: "server",
            message,
          });
        });
        return;
      }

      toast.error(t("messages.saveFailed"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{formTitle}</DialogTitle>
          <DialogDescription>{formDescription}</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit as any)} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{t("fields.name")}</FieldLabel>
                  <Input {...field} placeholder={t("placeholders.name")} disabled={isSubmitting} />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="type"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{t("fields.type")}</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("placeholders.type")} />
                    </SelectTrigger>
                    <SelectContent>
                      {scriptTypeOptions.map((type) => (
                        <SelectItem key={type} value={type}>
                          {t(`types.${type}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <Controller
            name="url"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>{t("fields.url")}</FieldLabel>
                <Input
                  {...field}
                  type="url"
                  placeholder={t("placeholders.url")}
                  disabled={isSubmitting}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="code"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>{t("fields.code")}</FieldLabel>
                <Textarea
                  {...field}
                  rows={6}
                  placeholder={t("placeholders.code")}
                  disabled={isSubmitting}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              name="placement"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{t("fields.placement")}</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("placeholders.placement")} />
                    </SelectTrigger>
                    <SelectContent>
                      {placementOptions.map((placement) => (
                        <SelectItem key={placement} value={placement}>
                          {t(`placements.${placement}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="strategy"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{t("fields.strategy")}</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("placeholders.strategy")} />
                    </SelectTrigger>
                    <SelectContent>
                      {strategyOptions.map((strategy) => (
                        <SelectItem key={strategy} value={strategy}>
                          {t(`strategies.${strategy}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              name="sort_order"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{t("fields.sortOrder")}</FieldLabel>
                  <Input
                    value={field.value ?? 0}
                    type="number"
                    min={0}
                    step={1}
                    disabled={isSubmitting}
                    onChange={(event) => {
                      const nextValue = event.target.value === "" ? 0 : Number(event.target.value);
                      field.onChange(nextValue);
                    }}
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="flex items-end">
              <Controller
                name="is_active"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="w-full">
                    <div className="flex items-center justify-between rounded-lg border border-input bg-background p-3">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">{t("fields.active")}</Label>
                        <p className="text-xs text-muted-foreground">{t("activeDescription")}</p>
                      </div>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                        aria-label={t("toggleActive")}
                      />
                    </div>
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => handleClose(false)} disabled={isSubmitting}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="me-2 size-4 animate-spin" />}
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
