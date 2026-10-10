"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";

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
    Controller,
    useForm,
} from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import {
    useCreateServiceMutation,
} from "@/lib/services/services-api";

import { toast } from "sonner";

interface Props {
    open: boolean;
    setOpen: (value: boolean) => void;
}

export default function AddServiceDialog({
    open,
    setOpen,
}: Props) {
    const t = useTranslations("services.dialog");

    const [
        createService,
        { isLoading },
    ] = useCreateServiceMutation();

    const [imagePreview, setImagePreview] =
        useState<string | null>(null);

    const serviceSchema = z.object({
        name: z
            .string()
            .min(1, t("validation.nameRequired"))
            .max(
                255,
                t("validation.nameMax")
            ),

        name_ar: z
            .string()
            .max(
                255,
                t("validation.nameMax")
            )
            .optional(),

        slug: z
            .string()
            .min(1, t("validation.slugRequired"))
            .max(
                255,
                t("validation.slugMax")
            ),

        slug_ar: z
            .string()
            .max(
                255,
                t("validation.slugMax")
            )
            .optional(),

        description: z
            .string()
            .max(
                5000,
                t("validation.descriptionMax")
            )
            .optional(),

        description_ar: z
            .string()
            .max(
                5000,
                t("validation.descriptionMax")
            )
            .optional(),

        image: z
            .instanceof(File)
            .refine(
                (file) =>
                    file.size <=
                    2 * 1024 * 1024,
                t("validation.imageSize")
            )
            .refine(
                (file) =>
                    [
                        "image/jpeg",
                        "image/png",
                        "image/webp",
                    ].includes(file.type),
                t("validation.imageType")
            )
            .optional(),
    });

    type ServiceFormValues =
        z.infer<typeof serviceSchema>;

    const form =
        useForm<ServiceFormValues>({
            resolver: zodResolver(
                serviceSchema
            ),
            defaultValues: {
                name: "",
                name_ar: "",
                slug: "",
                slug_ar: "",
                description: "",
                description_ar: "",
                image: undefined,
            },
        });

    const selectedImage =
        form.watch("image");

    useEffect(() => {
        if (!selectedImage) {
            setImagePreview(null);
            return;
        }

        const objectUrl =
            URL.createObjectURL(
                selectedImage
            );

        setImagePreview(objectUrl);

        return () => {
            URL.revokeObjectURL(
                objectUrl
            );
        };
    }, [selectedImage]);

    async function onSubmit(
        values: ServiceFormValues
    ) {
        try {
            const formData =
                new FormData();

            formData.append(
                "name",
                values.name
            );

            formData.append(
                "name_ar",
                values.name_ar ?? ""
            );

            formData.append(
                "slug",
                values.slug
            );

            formData.append(
                "slug_ar",
                values.slug_ar ?? ""
            );

            formData.append(
                "description",
                values.description ?? ""
            );

            formData.append(
                "description_ar",
                values.description_ar ?? ""
            );

            if (values.image) {
                formData.append(
                    "image",
                    values.image
                );
            }

            await createService(
                formData
            ).unwrap();

            setOpen(false);

            form.reset();

            setImagePreview(null);

            toast.success(
                t("messages.created")
            );
        } catch {
            toast.error(
                t("messages.createFailed")
            );
        }
    }

    function handleRemoveImage() {
        form.setValue(
            "image",
            undefined,
            {
                shouldValidate: true,
                shouldDirty: true,
            }
        );

        setImagePreview(null);
    }

    function handleOpenChange(
        value: boolean
    ) {
        setOpen(value);

        if (!value) {
            form.reset();
            setImagePreview(null);
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={handleOpenChange}
        >
            <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-h-[80vh] sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {t("title")}
                    </DialogTitle>

                    <DialogDescription>
                        {t("description")}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={form.handleSubmit(
                        onSubmit
                    )}
                    className="mt-3 space-y-4"
                >
                    {/* Name */}
                    <Controller
                        name="name"
                        control={form.control}
                        render={({
                            field,
                            fieldState,
                        }) => (
                            <Field
                                data-invalid={
                                    fieldState.invalid
                                }
                            >
                                <FieldLabel>
                                    {t("nameEnglish")}
                                </FieldLabel>

                                <Input
                                    {...field}
                                    placeholder={t(
                                        "namePlaceholder"
                                    )}
                                    disabled={
                                        isLoading
                                    }
                                />

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[
                                            fieldState.error,
                                        ]}
                                    />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="name_ar"
                        control={form.control}
                        render={({
                            field,
                            fieldState,
                        }) => (
                            <Field
                                data-invalid={
                                    fieldState.invalid
                                }
                            >
                                <FieldLabel>
                                    {t("nameArabic")}
                                </FieldLabel>

                                <Input
                                    {...field}
                                    dir="rtl"
                                    placeholder={t(
                                        "nameArabicPlaceholder"
                                    )}
                                    disabled={isLoading}
                                />

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                    />
                                )}
                            </Field>
                        )}
                    />

                    {/* Slug */}
                    <Controller
                        name="slug"
                        control={form.control}
                        render={({
                            field,
                            fieldState,
                        }) => (
                            <Field
                                data-invalid={
                                    fieldState.invalid
                                }
                            >
                                <FieldLabel>
                                    {t("slugEnglish")}
                                </FieldLabel>

                                <Input
                                    {...field}
                                    placeholder="service-slug"
                                    disabled={
                                        isLoading
                                    }
                                />

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[
                                            fieldState.error,
                                        ]}
                                    />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="slug_ar"
                        control={form.control}
                        render={({
                            field,
                            fieldState,
                        }) => (
                            <Field
                                data-invalid={
                                    fieldState.invalid
                                }
                            >
                                <FieldLabel>
                                    {t("slugArabic")}
                                </FieldLabel>

                                <Input
                                    {...field}
                                    dir="rtl"
                                    placeholder={t(
                                        "slugArabicPlaceholder"
                                    )}
                                    disabled={isLoading}
                                />

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                    />
                                )}
                            </Field>
                        )}
                    />

                    {/* Description */}
                    <Controller
                        name="description"
                        control={form.control}
                        render={({
                            field,
                            fieldState,
                        }) => (
                            <Field
                                data-invalid={
                                    fieldState.invalid
                                }
                            >
                                <FieldLabel>
                                    {t("descriptionEnglish")}
                                </FieldLabel>

                                <Textarea
                                    {...field}
                                    placeholder={t(
                                        "descriptionPlaceholder"
                                    )}
                                    className="min-h-28 resize-none"
                                    disabled={
                                        isLoading
                                    }
                                />

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[
                                            fieldState.error,
                                        ]}
                                    />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="description_ar"
                        control={form.control}
                        render={({
                            field,
                            fieldState,
                        }) => (
                            <Field
                                data-invalid={
                                    fieldState.invalid
                                }
                            >
                                <FieldLabel>
                                    {t("descriptionArabic")}
                                </FieldLabel>

                                <Textarea
                                    {...field}
                                    dir="rtl"
                                    placeholder={t(
                                        "descriptionArabicPlaceholder"
                                    )}
                                    className="min-h-28 resize-none"
                                    disabled={isLoading}
                                />

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                    />
                                )}
                            </Field>
                        )}
                    />

                    {/* Image */}
                    <Controller
                        name="image"
                        control={form.control}
                        render={({
                            field,
                            fieldState,
                        }) => (
                            <Field
                                data-invalid={
                                    fieldState.invalid
                                }
                            >
                                <FieldLabel>
                                    {t("image")}
                                </FieldLabel>

                                {imagePreview ? (
                                    <div className="relative mx-auto size-40 overflow-hidden rounded-lg border">
                                        <Image
                                            src={
                                                imagePreview
                                            }
                                            alt={t(
                                                "imagePreview"
                                            )}
                                            width={160}
                                            height={160}
                                            unoptimized
                                            className="size-full object-cover"
                                        />

                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute right-2 top-2"
                                            onClick={
                                                handleRemoveImage
                                            }
                                            disabled={
                                                isLoading
                                            }
                                        >
                                            <X className="size-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <label
                                        htmlFor="service-image"
                                        className="mx-auto flex size-40 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed transition-colors hover:bg-muted/50"
                                    >
                                        <ImagePlus className="mb-3 size-8 text-muted-foreground" />

                                        <span className="text-sm font-medium">
                                            {t(
                                                "chooseImage"
                                            )}
                                        </span>

                                        <span className="mt-1 text-xs text-muted-foreground">
                                            {t(
                                                "imageHint"
                                            )}
                                        </span>
                                    </label>
                                )}

                                <Input
                                    id="service-image"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="sr-only"
                                    disabled={
                                        isLoading
                                    }
                                    onChange={(
                                        event
                                    ) => {
                                        const file =
                                            event.target.files?.[0];

                                        field.onChange(
                                            file
                                        );
                                    }}
                                />

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[
                                            fieldState.error,
                                        ]}
                                    />
                                )}
                            </Field>
                        )}
                    />

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                handleOpenChange(
                                    false
                                )
                            }
                            disabled={
                                isLoading
                            }
                        >
                            {t("cancel")}
                        </Button>

                        <Button
                            type="submit"
                            disabled={
                                isLoading
                            }
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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