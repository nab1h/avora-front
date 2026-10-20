
"use client";

import {
    useState,
    type Dispatch,
    type FormEvent,
    type SetStateAction,
} from "react";

import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useCreateSpecificationMutation } from "@/lib/services/specifications-api";

interface AddSpecificationDialogProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

interface SpecificationForm {
    spec_key: string;
    name_ar: string;
    name_en: string;
    unit: string;
    sort_order: string;
    status: "active" | "inactive";
}

const initialForm: SpecificationForm = {
    spec_key: "",
    name_ar: "",
    name_en: "",
    unit: "",
    sort_order: "0",
    status: "active",
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function getApiErrorMessage(error: unknown): string | undefined {
    if (!isRecord(error)) return undefined;

    const data = isRecord(error.data) ? error.data : undefined;
    const validationErrors = data && isRecord(data.errors)
        ? Object.values(data.errors).flatMap((value) => {
            if (typeof value === "string") return [value];
            if (Array.isArray(value)) {
                return value.filter(
                    (message): message is string => typeof message === "string",
                );
            }
            return [];
        })
        : [];

    if (validationErrors.length > 0) {
        return validationErrors.join(" ");
    }

    const message = data?.message ?? error.message;
    return typeof message === "string" && message.trim()
        ? message
        : undefined;
}

export default function AddSpecificationDialog({
    open,
    setOpen,
}: AddSpecificationDialogProps) {
    const t = useTranslations("specifications.dialog");

    const [createSpecification, { isLoading }] =
        useCreateSpecificationMutation();

    const [form, setForm] =
        useState<SpecificationForm>({ ...initialForm });

    function updateField<K extends keyof SpecificationForm>(
        field: K,
        value: SpecificationForm[K],
    ) {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));
    }

    function handleOpenChange(nextOpen: boolean) {
        if (isLoading) return;

        setOpen(nextOpen);

        if (!nextOpen) {
            setForm({ ...initialForm });
        }
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const payload = {
            spec_key: form.spec_key.trim(),
            name_ar: form.name_ar.trim(),
            name_en: form.name_en.trim(),
            unit: form.unit.trim() || null,
            sort_order: Number(form.sort_order),
            status: form.status,
        };

        if (!/^[a-z][a-z0-9_]*$/.test(payload.spec_key)) {
            toast.error(t("validation.specKeyFormat"));
            return;
        }

        try {
            await createSpecification(payload).unwrap();

            toast.success(t("messages.created"));

            setForm({ ...initialForm });
            setOpen(false);
        } catch (error) {
            const message = getApiErrorMessage(error);
            const details = isRecord(error)
                ? {
                    status: error.status,
                    data: error.data,
                    message: error.message,
                }
                : error instanceof Error
                    ? error.message
                    : error;

            console.error("Create specification failed:", details);
            toast.error(message ?? t("messages.createFailed"));
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {t("title")}
                    </DialogTitle>

                    <DialogDescription>
                        {t("description")}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label
                            htmlFor="spec_key"
                            className="text-sm font-medium"
                        >
                            {t("specKey")}
                        </label>

                        <Input
                            id="spec_key"
                            value={form.spec_key}
                            onChange={(event) =>
                                updateField("spec_key", event.target.value)
                            }
                            placeholder={t("specKeyPlaceholder")}
                            dir="ltr"
                            pattern="[a-z][a-z0-9_]*"
                            maxLength={100}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label
                                htmlFor="name_ar"
                                className="text-sm font-medium"
                            >
                                {t("nameArabic")}
                            </label>

                            <Input
                                id="name_ar"
                                value={form.name_ar}
                                onChange={(event) =>
                                    updateField("name_ar", event.target.value)
                                }
                                placeholder={t("nameArabicPlaceholder")}
                                dir="rtl"
                                maxLength={255}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="name_en"
                                className="text-sm font-medium"
                            >
                                {t("nameEnglish")}
                            </label>

                            <Input
                                id="name_en"
                                value={form.name_en}
                                onChange={(event) =>
                                    updateField("name_en", event.target.value)
                                }
                                placeholder={t("nameEnglishPlaceholder")}
                                dir="ltr"
                                maxLength={255}
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label
                                htmlFor="unit"
                                className="text-sm font-medium"
                            >
                                {t("unit")}
                            </label>

                            <Input
                                id="unit"
                                value={form.unit}
                                onChange={(event) =>
                                    updateField("unit", event.target.value)
                                }
                                placeholder={t("unitPlaceholder")}
                                maxLength={50}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="sort_order"
                                className="text-sm font-medium"
                            >
                                {t("sortOrder")}
                            </label>

                            <Input
                                id="sort_order"
                                type="number"
                                min={0}
                                max={4294967295}
                                step={1}
                                value={form.sort_order}
                                onChange={(event) =>
                                    updateField("sort_order", event.target.value)
                                }
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="status"
                            className="text-sm font-medium"
                        >
                            {t("status")}
                        </label>

                        <select
                            id="status"
                            value={form.status}
                            onChange={(event) =>
                                updateField(
                                    "status",
                                    event.target.value as "active" | "inactive",
                                )
                            }
                            disabled={isLoading}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                            <option value="active">
                                {t("active")}
                            </option>

                            <option value="inactive">
                                {t("inactive")}
                            </option>
                        </select>
                    </div>

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
                            {isLoading && (
                                <Loader2 className="size-4 animate-spin" />
                            )}

                            {isLoading
                                ? t("creating")
                                : t("create")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
