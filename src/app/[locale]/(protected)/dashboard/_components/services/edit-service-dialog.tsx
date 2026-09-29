import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Service, useEditServiceMutation } from "@/lib/services/services-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Image as ImageIcon } from "lucide-react";



interface Props {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    service: Service | null;
}

function getImageUrl(image: string | null | undefined) {
    if (!image) return null;
    if (/^https?:\/\//i.test(image)) return image;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "");
    return apiUrl ? `${apiUrl}/storage/${image.replace(/^\/+/, "")}` : null;
}



export default function EditServiceDialog({ open, onOpenChange, service }: Props) {

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const serviceSchema = z.object({

        name: z
            .string()
            .min(1, "Name is required")
            .max(255, "Name must not exceed 255 characters"),

        slug: z
            .string()
            .min(1, "Slug is required")
            .max(255, "Slug must not exceed 255 characters"),

        description: z
            .string()
            .max(5000, "Description must not exceed 5000 characters")
            .optional(),

        image: z
            .instanceof(File)
            .refine(
                (file) => file.size <= 2 * 1024 * 1024,
                "Image must not exceed 2MB"
            )
            .refine(
                (file) =>
                    [
                        "image/jpeg",
                        "image/png",
                        "image/webp",
                    ].includes(file.type),
                "Only JPG, PNG and WebP images are allowed"
            )
            .optional(),

    });

    type ServiceFormValues = z.infer<typeof serviceSchema>;

    const form = useForm<ServiceFormValues>({
        resolver: zodResolver(serviceSchema),
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
                description: service.description ?? "",
                image: undefined,
            });
            setImagePreview(getImageUrl(service.image));
        }
    }, [open, service, reset]);

    const [editService, { isLoading }] = useEditServiceMutation();

    async function onSubmit(values: ServiceFormValues) {
        if (!service) {
            return;
        }

        try {
            const formData = new FormData();

            formData.append("_method", "PUT");
            formData.append("name", values.name);
            formData.append("slug", values.slug);

            if (values.description) {
                formData.append("description", values.description);
            }

            if (values.image) {
                formData.append("image", values.image);
            }

            await editService({
                id: service.id,
                formData,
            }).unwrap();

            onOpenChange(false);

            toast.success("Service updated successfully.");
        } catch {
            toast.error(
                "Failed to update service. Please try again."
            );
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>

            <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-h-[80vh] sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        Edit Service
                    </DialogTitle>

                    <DialogDescription>
                        {`Edit the ${service?.name}.`}
                    </DialogDescription>
                </DialogHeader>


                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-3 space-y-4">

                    <div className="grid gap-4 sm:grid-cols-2">

                        <Controller
                            name="name"
                            control={form.control}
                            render={({
                                field,
                                fieldState
                            }) => (
                                <Field data-invalid={fieldState.invalid} >
                                    <FieldLabel> Name </FieldLabel>
                                    <Input
                                        {...field}
                                        placeholder="Enter service name"
                                        disabled={isLoading}
                                    />
                                    {
                                        fieldState.invalid && <FieldError errors={[fieldState.error]} />
                                    }
                                </Field>)}
                        />

                        <Controller
                            name="slug"
                            control={form.control}
                            render={({
                                field,
                                fieldState
                            }) => (
                                <Field data-invalid={fieldState.invalid} >
                                    <FieldLabel> Slug </FieldLabel>
                                    <Input
                                        {...field}
                                        placeholder="Enter service slug"
                                        disabled={isLoading}
                                    />
                                    {
                                        fieldState.invalid && <FieldError errors={[fieldState.error]} />
                                    }
                                </Field>)}
                        />

                    </div>

                    <Controller
                        name="description"
                        control={form.control}
                        render={({
                            field,
                            fieldState
                        }) => (
                            <Field data-invalid={fieldState.invalid} >
                                <FieldLabel> Description </FieldLabel>
                                <Textarea
                                    {...field}
                                    rows={4}
                                    placeholder="Enter service description"
                                    disabled={isLoading}
                                />
                                {
                                    fieldState.invalid && <FieldError errors={[fieldState.error]} />
                                }
                            </Field>)}
                    />

                    <Controller
                        name="image"
                        control={form.control}
                        render={({
                            field: { onChange, onBlur, name: fieldName },
                            fieldState
                        }) => (
                            <Field data-invalid={fieldState.invalid} >
                                <FieldLabel> Image </FieldLabel>
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
                                        {
                                            imagePreview ? (
                                                <img
                                                    src={imagePreview}
                                                    alt="Service image preview"
                                                    className="size-full object-cover"
                                                />
                                            ) : (
                                                <ImageIcon className="size-8 text-muted-foreground" />
                                            )
                                        }
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <Input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            name={fieldName}
                                            onBlur={onBlur}
                                            onChange={(event) => {
                                                const file = event.target.files?.[0];
                                                if (imagePreview?.startsWith("blob:")) {
                                                    URL.revokeObjectURL(imagePreview);
                                                }
                                                setImagePreview(file ? URL.createObjectURL(file) : null);
                                                onChange(file);
                                            }}
                                            disabled={isLoading}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            JPG, PNG or WebP — max 2MB
                                        </p>
                                    </div>
                                </div>
                                {
                                    fieldState.invalid && <FieldError errors={[fieldState.error]} />
                                }
                            </Field>)}
                    />

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>

                        {
                            isLoading ? (
                                <Button variant="secondary" disabled>
                                    Saving
                                    <Spinner data-icon="inline-start" />
                                </Button>
                            ) : (
                                <Button type="submit">
                                    Save changes
                                </Button>
                            )
                        }
                    </div>

                </form>

            </DialogContent>

        </Dialog>
    );
}