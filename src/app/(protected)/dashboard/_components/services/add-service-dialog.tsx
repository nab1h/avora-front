"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";

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

import {
    z,
} from "zod";

import {
    zodResolver,
} from "@hookform/resolvers/zod";

import {
    useCreateServiceMutation,
} from "@/lib/services/services-api";

import { toast } from "sonner";


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


interface Props {

    open: boolean;

    setOpen: (value: boolean) => void;

}


export default function AddServiceDialog({

    open,

    setOpen,

}: Props) {


    const [

        createService,

        {
            isLoading
        }

    ] = useCreateServiceMutation();


    const [imagePreview, setImagePreview] =
        useState<string | null>(null);


    const form = useForm<ServiceFormValues>({

        resolver: zodResolver(serviceSchema),

        defaultValues: {

            name: "",

            slug: "",

            description: "",

            image: undefined,

        },

    });


    const selectedImage = form.watch("image");


    useEffect(() => {

        if (!selectedImage) {

            setImagePreview(null);

            return;

        }


        const objectUrl =
            URL.createObjectURL(selectedImage);


        setImagePreview(objectUrl);


        return () => {

            URL.revokeObjectURL(objectUrl);

        };

    }, [selectedImage]);


    async function onSubmit(
        values: ServiceFormValues
    ) {

        try {

            const formData = new FormData();


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


            await createService(
                formData
            ).unwrap();


            setOpen(false);

            form.reset();

            setImagePreview(null);


            toast.success(
                "Service created successfully."
            );


        } catch {

            toast.error(
                "Failed to create service. Please try again."
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

                        Add Service

                    </DialogTitle>


                    <DialogDescription>

                        Create a new service.

                    </DialogDescription>

                </DialogHeader>


                <form

                    onSubmit={
                        form.handleSubmit(onSubmit)
                    }

                    className="mt-3 space-y-4"

                >


                    <Controller

                        name="name"

                        control={form.control}

                        render={({
                            field,
                            fieldState
                        }) => (

                            <Field

                                data-invalid={
                                    fieldState.invalid
                                }

                            >

                                <FieldLabel>

                                    Name

                                </FieldLabel>


                                <Input

                                    {...field}

                                    placeholder="Enter service name"

                                    disabled={isLoading}

                                />


                                {
                                    fieldState.invalid &&

                                    <FieldError

                                        errors={[
                                            fieldState.error
                                        ]}

                                    />

                                }

                            </Field>

                        )}

                    />


                    <Controller

                        name="slug"

                        control={form.control}

                        render={({
                            field,
                            fieldState
                        }) => (

                            <Field

                                data-invalid={
                                    fieldState.invalid
                                }

                            >

                                <FieldLabel>

                                    Slug

                                </FieldLabel>


                                <Input

                                    {...field}

                                    placeholder="service-slug"

                                    disabled={isLoading}

                                />


                                {
                                    fieldState.invalid &&

                                    <FieldError

                                        errors={[
                                            fieldState.error
                                        ]}

                                    />

                                }

                            </Field>

                        )}

                    />


                    <Controller

                        name="description"

                        control={form.control}

                        render={({
                            field,
                            fieldState
                        }) => (

                            <Field

                                data-invalid={
                                    fieldState.invalid
                                }

                            >

                                <FieldLabel>

                                    Description

                                </FieldLabel>


                                <Textarea

                                    {...field}

                                    placeholder="Enter service description"

                                    className="min-h-28 resize-none"

                                    disabled={isLoading}

                                />


                                {
                                    fieldState.invalid &&

                                    <FieldError

                                        errors={[
                                            fieldState.error
                                        ]}

                                    />

                                }

                            </Field>

                        )}

                    />


                    <Controller

                        name="image"

                        control={form.control}

                        render={({
                            field,
                            fieldState
                        }) => (

                            <Field

                                data-invalid={
                                    fieldState.invalid
                                }

                            >

                                <FieldLabel>

                                    Image

                                </FieldLabel>


                                {
                                    imagePreview ? (

                                        <div className="relative mx-auto size-40 overflow-hidden rounded-lg border">

                                            <Image

                                                src={
                                                    imagePreview
                                                }

                                                alt="Service preview"

                                                width={160}

                                                height={160}

                                                unoptimized

                                                className="size-full object-cover"

                                            />


                                            <Button

                                                type="button"

                                                variant="destructive"

                                                size="icon"

                                                className="
                                                    absolute
                                                    right-2
                                                    top-2
                                                "

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

                                            <ImagePlus
                                                className="
                                                    mb-3
                                                    size-8
                                                    text-muted-foreground
                                                "
                                            />


                                            <span className="text-sm font-medium">

                                                Choose an image

                                            </span>


                                            <span className="
                                                mt-1
                                                text-xs
                                                text-muted-foreground
                                            ">

                                                JPG, PNG or WebP up to 2MB

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

                                    onChange={(event) => {

                                        const file =
                                            event.target.files?.[0];


                                        field.onChange(
                                            file
                                        );

                                    }}

                                />


                                {
                                    fieldState.invalid &&

                                    <FieldError

                                        errors={[
                                            fieldState.error
                                        ]}

                                    />

                                }

                            </Field>

                        )}

                    />


                    <DialogFooter>

                        <Button

                            type="button"

                            variant="outline"

                            onClick={() =>
                                handleOpenChange(false)
                            }

                            disabled={isLoading}

                        >

                            Cancel

                        </Button>


                        <Button

                            type="submit"

                            disabled={isLoading}

                        >

                            {
                                isLoading ? (

                                    <>

                                        <Loader2
                                            className="
                                                mr-2
                                                h-4
                                                w-4
                                                animate-spin
                                            "
                                        />

                                        Creating...

                                    </>

                                ) : (

                                    "Create Service"

                                )
                            }

                        </Button>

                    </DialogFooter>


                </form>


            </DialogContent>


        </Dialog>

    );

}