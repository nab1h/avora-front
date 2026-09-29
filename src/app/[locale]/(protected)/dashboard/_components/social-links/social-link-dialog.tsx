"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
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

import {
    Field,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";

import { Switch } from "@/components/ui/switch";

import {
    useGetSocialPlatformsQuery,
} from "@/lib/services/social-platforms";

import {
    useCreateSocialLinkMutation,
    useUpdateSocialLinkMutation,
    type SocialLink,
} from "@/lib/services/social-links";

import SocialPlatformIcon from "@/components/social-platform-icon";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    socialLink?: SocialLink | null;
}

interface FormValues {
    social_platform_id: string;
    url: string;
    is_active: boolean;
    sort_order: number;
}

export default function SocialLinkDialog({
    open,
    onOpenChange,
    socialLink,
}: Props) {
    const t = useTranslations("socialLinks.dialog");

    const isEdit = Boolean(socialLink);

    const {
        data: platforms,
        isLoading: isPlatformsLoading,
    } = useGetSocialPlatformsQuery();

    const [createSocialLink, { isLoading: isCreating }] =
        useCreateSocialLinkMutation();

    const [updateSocialLink, { isLoading: isUpdating }] =
        useUpdateSocialLinkMutation();

    const form = useForm<FormValues>({
        defaultValues: {
            social_platform_id: "",
            url: "",
            is_active: true,
            sort_order: 1,
        },
    });

    const isSubmitting =
        isCreating || isUpdating;

    useEffect(() => {
        if (socialLink) {
            form.reset({
                social_platform_id: String(
                    socialLink.platform.id
                ),
                url: socialLink.url,
                is_active: socialLink.is_active,
                sort_order: socialLink.sort_order,
            });
        } else {
            form.reset({
                social_platform_id: "",
                url: "",
                is_active: true,
                sort_order: 1,
            });
        }
    }, [socialLink, form]);

    const onSubmit = async (
        values: FormValues
    ) => {
        try {
            const data = {
                social_platform_id: Number(
                    values.social_platform_id
                ),
                url: values.url,
                is_active: values.is_active,
                sort_order: Number(
                    values.sort_order
                ),
            };

            if (socialLink) {
                await updateSocialLink({
                    id: socialLink.id,
                    data,
                }).unwrap();

                toast.success(
                    t("messages.updated")
                );
            } else {
                await createSocialLink(
                    data
                ).unwrap();

                toast.success(
                    t("messages.created")
                );
            }

            onOpenChange(false);
            form.reset();
        } catch (error: any) {
            console.error(
                "Social link error:",
                error
            );

            toast.error(
                error?.data?.message ||
                    error?.data?.error ||
                    t("messages.error")
            );
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isEdit
                            ? t("editTitle")
                            : t("addTitle")}
                    </DialogTitle>

                    <DialogDescription>
                        {isEdit
                            ? t("editDescription")
                            : t("addDescription")}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={form.handleSubmit(
                        onSubmit
                    )}
                    className="space-y-5"
                >
                    {/* Platform */}
                    <Field>
                        <FieldLabel>
                            {t("platform")}
                        </FieldLabel>

                        <Select
                            value={form.watch(
                                "social_platform_id"
                            )}
                            onValueChange={(value) => {
                                if (
                                    value !==
                                    null
                                ) {
                                    form.setValue(
                                        "social_platform_id",
                                        value,
                                        {
                                            shouldValidate:
                                                true,
                                        }
                                    );
                                }
                            }}
                            disabled={
                                isPlatformsLoading ||
                                isSubmitting
                            }
                        >
                            <SelectTrigger className="size-11 justify-center p-0">
                                <SelectValue
                                    placeholder={t(
                                        "selectPlatform"
                                    )}
                                />
                            </SelectTrigger>

                            <SelectContent>
                                {platforms?.map(
                                    (
                                        platform
                                    ) => (
                                        <SelectItem
                                            key={
                                                platform.id
                                            }
                                            value={String(
                                                platform.id
                                            )}
                                        >
                                            <div className="flex items-center gap-2">
                                                <SocialPlatformIcon
                                                    icon={
                                                        platform.icon
                                                    }
                                                    className="size-5"
                                                />

                                                <span>
                                                    {
                                                        platform.name
                                                    }
                                                </span>
                                            </div>
                                        </SelectItem>
                                    )
                                )}
                            </SelectContent>
                        </Select>

                        {form.formState
                            .errors
                            .social_platform_id && (
                            <FieldError>
                                {
                                    form
                                        .formState
                                        .errors
                                        .social_platform_id
                                        .message
                                }
                            </FieldError>
                        )}
                    </Field>

                    {/* URL */}
                    <Field>
                        <FieldLabel>
                            {t("url")}
                        </FieldLabel>

                        <Input
                            {...form.register(
                                "url",
                                {
                                    required:
                                        t(
                                            "validation.urlRequired"
                                        ),
                                }
                            )}
                            placeholder="https://instagram.com/avora"
                            disabled={
                                isSubmitting
                            }
                        />

                        {form.formState
                            .errors.url && (
                            <FieldError>
                                {
                                    form
                                        .formState
                                        .errors
                                        .url.message
                                }
                            </FieldError>
                        )}
                    </Field>

                    {/* Sort Order */}
                    <Field>
                        <FieldLabel>
                            {t("sortOrder")}
                        </FieldLabel>

                        <Input
                            type="number"
                            {...form.register(
                                "sort_order",
                                {
                                    required:
                                        t(
                                            "validation.sortOrderRequired"
                                        ),
                                    valueAsNumber:
                                        true,
                                }
                            )}
                            disabled={
                                isSubmitting
                            }
                        />
                    </Field>

                    {/* Active */}
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium">
                                {t("active")}
                            </p>

                            <p className="text-sm text-muted-foreground">
                                {t(
                                    "activeDescription"
                                )}
                            </p>
                        </div>

                        <Switch
                            checked={form.watch(
                                "is_active"
                            )}
                            onCheckedChange={(
                                checked
                            ) =>
                                form.setValue(
                                    "is_active",
                                    checked
                                )
                            }
                            disabled={
                                isSubmitting
                            }
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                onOpenChange(
                                    false
                                )
                            }
                            disabled={
                                isSubmitting
                            }
                        >
                            {t("cancel")}
                        </Button>

                        <Button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                isPlatformsLoading
                            }
                        >
                            {isSubmitting && (
                                <Loader2 className="size-4 animate-spin" />
                            )}

                            {isEdit
                                ? t("update")
                                : t("create")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}