
"use client";

import {
    useEffect,
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

import {
    type Specification,
    useEditSpecificationMutation,
} from "@/lib/services/specifications-api";

interface EditSpecificationDialogProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    specification: Specification | null;
}

interface SpecificationForm {
    spec_key: string;
    name_ar: string;
    name_en: string;
    unit: string;
    sort_order: string;
    status: "active" | "inactive";
}

const emptyForm = (): SpecificationForm => ({
    spec_key: "",
    name_ar: "",
    name_en: "",
    unit: "",
    sort_order: "0",
    status: "active",
});

export default function EditSpecificationDialog({
    open,
    setOpen,
    specification,
}: EditSpecificationDialogProps) {
    const t = useTranslations("specifications.dialog");

    const [editSpecification, { isLoading }] =
        useEditSpecificationMutation();

    const [form, setForm] =
        useState<SpecificationForm>(emptyForm());

    useEffect(() => {
        if (open && specification) {
            setForm({
                spec_key: specification.spec_key,
                name_ar: specification.name_ar,
                name_en: specification.name_en,
                unit: specification.unit ?? "",
                sort_order: String(specification.sort_order),
                status: specification.status,
            });
        }

        if (!open) {
            setForm(emptyForm());
        }
    }, [open, specification]);

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
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        if (!specification) return;

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
            await editSpecification({
                id: specification.id,
                body: payload,
            }).unwrap();

            toast.success(t("messages.updated"));
            setOpen(false);
        } catch (error) {
            console.error("Update specification failed:", error);
            toast.error(t("messages.updateFailed"));
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {t("editTitle")}
                    </DialogTitle>

                    <DialogDescription>
                        {t("editDescription")}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    <div className="space-y-2">
                        <label
                            htmlFor="edit_spec_key"
                            className="text-sm font-medium"
                        >
                            {t("specKey")}
                        </label>

                        <Input
                            id="edit_spec_key"
                            value={form.spec_key}
                            onChange={(event) =>
                                updateField(
                                    "spec_key",
                                    event.target.value,
                                )
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
                                htmlFor="edit_name_ar"
                                className="text-sm font-medium"
                            >
                                {t("nameArabic")}
                            </label>

                            <Input
                                id="edit_name_ar"
                                value={form.name_ar}
                                onChange={(event) =>
                                    updateField(
                                        "name_ar",
                                        event.target.value,
                                    )
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
                                htmlFor="edit_name_en"
                                className="text-sm font-medium"
                            >
                                {t("nameEnglish")}
                            </label>

                            <Input
                                id="edit_name_en"
                                value={form.name_en}
                                onChange={(event) =>
                                    updateField(
                                        "name_en",
                                        event.target.value,
                                    )
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
                                htmlFor="edit_unit"
                                className="text-sm font-medium"
                            >
                                {t("unit")}
                            </label>

                            <Input
                                id="edit_unit"
                                value={form.unit}
                                onChange={(event) =>
                                    updateField(
                                        "unit",
                                        event.target.value,
                                    )
                                }
                                placeholder={t("unitPlaceholder")}
                                maxLength={50}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="edit_sort_order"
                                className="text-sm font-medium"
                            >
                                {t("sortOrder")}
                            </label>

                            <Input
                                id="edit_sort_order"
                                type="number"
                                min={0}
                                max={4294967295}
                                step={1}
                                value={form.sort_order}
                                onChange={(event) =>
                                    updateField(
                                        "sort_order",
                                        event.target.value,
                                    )
                                }
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="edit_status"
                            className="text-sm font-medium"
                        >
                            {t("status")}
                        </label>

                        <select
                            id="edit_status"
                            value={form.status}
                            onChange={(event) =>
                                updateField(
                                    "status",
                                    event.target.value as
                                        | "active"
                                        | "inactive",
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

                        <Button
                            type="submit"
                            disabled={isLoading || !specification}
                        >
                            {isLoading && (
                                <Loader2 className="size-4 animate-spin" />
                            )}

                            {isLoading
                                ? t("saving")
                                : t("saveChanges")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
