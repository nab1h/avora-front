"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    Field,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import {
    Service,
    useEditServiceMutation,
} from "@/lib/services/services-api";

import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect, useState } from "react";

import {
    Controller,
    useForm,
} from "react-hook-form";

import { toast } from "sonner";
import { useTranslations } from "next-intl";

import z from "zod";

import { Image as ImageIcon } from "lucide-react";

interface Props {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    service: Service | null;
}

function getImageUrl(
    image: string | null | undefined
) {
    if (!image) return null;

    if (/^https?:\/\//i.test(image)) {
        return image;
    }

    const apiUrl =
        process.env.NEXT_PUBLIC_API_URL?.replace(
            /\/api\/?$/,
            ""
        );

    return apiUrl
        ? `${apiUrl}/storage/${image.replace(
              /^\/+/,
              ""
          )}`
        : null;
}

export default function EditServiceDialog({
    open,
    onOpenChange,
    service,
}: Props) {
    const t = useTranslations(
        "services.dialog"
    );

    const [imagePreview, setImagePreview] =
        useState<string | null>(null);

    const serviceSchema = z.object({
        name: z
            .string()
            .min(
                1,
                t("validation.nameRequired")
            )
            .max(
                255,
                t("validation.nameMax")
            ),

        slug: z
            .string()
            .min(
                1,
                t("validation.slugRequired")
            )
            .max(
                255,
                t("validation.slugMax")
            ),

        description: z
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
                slug: "",
                description: "",
                image: undefined,
            },
        });

    const { reset } = form;

    useEffect(() => {
        if (open && service) {
            reset({
                name: service.name,
                slug: service.slug,
                description:
                    service.description ?? "",
                image: undefined,
            });

            setImagePreview(
                getImageUrl(service.image)
            );
        }
    }, [open, service, reset]);

    const [
        editService,
        { isLoading },
    ] = useEditServiceMutation();

    async function onSubmit(
        values: ServiceFormValues
    ) {
        if (!service) {
            return;
        }

        try {
            const formData =
                new FormData();

            formData.append(
                "_method",
                "PUT"
            );

            formData.append(
                "name",
                values.name
            );

            formData.append(
                "slug",
                values.slug
            );

            if (values.description) {
                formData.append(
                    "description",
                    values.description
                );
            }

            if (values.image) {
                formData.append(
                    "image",
                    values.image
                );
            }

            await editService({
                id: service.id,
                formData,
            }).unwrap();

            onOpenChange(false);

            toast.success(
                t("messages.updated")
            );
        } catch {
            toast.error(
                t("messages.updateFailed")
            );
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-h-[80vh] sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {t("editTitle")}
                    </DialogTitle>

                    <DialogDescription>
                        {t("editDescription", {
                            name:
                                service?.name ??
                                "",
                        })}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={form.handleSubmit(
                        onSubmit
                    )}
                    className="mt-3 space-y-4"
                >
                    <div className="grid gap-4 sm:grid-cols-2">
                        {/* Name */}
                        <Controller
                            name="name"
                            control={
                                form.control
                            }
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
                                        {t("name")}
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

                        {/* Slug */}
                        <Controller
                            name="slug"
                            control={
                                form.control
                            }
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
                                        {t("slug")}
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        placeholder={t(
                                            "slugPlaceholder"
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
                    </div>

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
                                    {t(
                                        "descriptionField"
                                    )}
                                </FieldLabel>

                                <Textarea
                                    {...field}
                                    rows={4}
                                    placeholder={t(
                                        "descriptionPlaceholder"
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

                    {/* Image */}
                    <Controller
                        name="image"
                        control={form.control}
                        render={({
                            field: {
                                onChange,
                                onBlur,
                                name: fieldName,
                            },
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

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
                                        {imagePreview ? (
                                            <img
                                                src={
                                                    imagePreview
                                                }
                                                alt={t(
                                                    "imagePreview"
                                                )}
                                                className="size-full object-cover"
                                            />
                                        ) : (
                                            <ImageIcon className="size-8 text-muted-foreground" />
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-1">
                                        <Input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            name={
                                                fieldName
                                            }
                                            onBlur={
                                                onBlur
                                            }
                                            onChange={(
                                                event
                                            ) => {
                                                const file =
                                                    event
                                                        .target
                                                        .files?.[0];

                                                if (
                                                    imagePreview?.startsWith(
                                                        "blob:"
                                                    )
                                                ) {
                                                    URL.revokeObjectURL(
                                                        imagePreview
                                                    );
                                                }

                                                setImagePreview(
                                                    file
                                                        ? URL.createObjectURL(
                                                              file
                                                          )
                                                        : getImageUrl(
                                                              service?.image
                                                          )
                                                );

                                                onChange(
                                                    file
                                                );
                                            }}
                                            disabled={
                                                isLoading
                                            }
                                        />

                                        <p className="text-xs text-muted-foreground">
                                            {t(
                                                "imageHint"
                                            )}
                                        </p>
                                    </div>
                                </div>

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

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                onOpenChange(
                                    false
                                )
                            }
                            disabled={
                                isLoading
                            }
                        >
                            {t("cancel")}
                        </Button>

                        {isLoading ? (
                            <Button
                                variant="secondary"
                                disabled
                            >
                                {t("saving")}
                                <Spinner data-icon="inline-start" />
                            </Button>
                        ) : (
                            <Button type="submit">
                                {t(
                                    "saveChanges"
                                )}
                            </Button>
                        )}
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}