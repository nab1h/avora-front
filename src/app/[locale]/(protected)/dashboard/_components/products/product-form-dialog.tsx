
"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent, type Dispatch, type SetStateAction } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Loader2, Plus, X, ImagePlus, Trash2, Check } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    type Product,
    type ProductPayload,
    useGetAdminProductQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useUploadProductImagesMutation,
    useDeleteProductImageMutation,
    ProductSpecificationValue,
    useUpdateProductColorsMutation,
} from "@/lib/services/products-api";
import { useGetPublicColorsQuery } from "@/lib/services/colors-api";

import {
    useGetCategoriesQuery,
} from "@/lib/services/categories-api";

import {
    useGetSpecificationsQuery,
} from "@/lib/services/specifications-api";
import { getPublicAssetUrl } from "@/lib/services/public-assets";

type ProductFormDialogProps = {
    mode: "create" | "edit";
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    product?: Product | null;
};

type ProductFormState = {
    category_id: string;
    name_ar: string;
    name_en: string;
    description_ar: string;
    description_en: string;
    price: string;
    sale_price: string;
    status: "active" | "inactive";
    is_featured: boolean;
    sort_order: string;
};

type SelectedSpecification = {
    specification_id: number;
    value_ar: string;
    value_en: string;
    sort_order: number;
};

function createSlug(value: string): string {
    return value
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function getSelectedSpecifications(
    specifications: ProductSpecificationValue[],
): SelectedSpecification[] {
    const selectedById = new Map<number, SelectedSpecification>();

    specifications.forEach((specification, index) => {
        const id = Number(
            specification.specification_id ?? specification.specification?.id,
        );

        if (!Number.isInteger(id) || id <= 0 || selectedById.has(id)) {
            return;
        }

        selectedById.set(id, {
            specification_id: id,
            value_ar: specification.value_ar ?? "",
            value_en: specification.value_en ?? "",
            sort_order: specification.sort_order ?? index + 1,
        });
    });

    return [...selectedById.values()];
}

function getProductFormState(source: Product): ProductFormState {
    return {
        category_id: String(source.category_id ?? ""),
        name_ar: source.name_ar ?? "",
        name_en: source.name_en ?? "",
        description_ar: source.description_ar ?? "",
        description_en: source.description_en ?? "",
        price: String(source.price ?? ""),
        sale_price:
            source.sale_price == null ? "" : String(source.sale_price),
        status: source.status === "inactive" ? "inactive" : "active",
        is_featured: Boolean(source.is_featured),
        sort_order: String(source.sort_order ?? 0),
    };
}

const emptyForm = (): ProductFormState => ({
    category_id: "",
    name_ar: "",
    name_en: "",
    description_ar: "",
    description_en: "",
    price: "",
    sale_price: "",
    status: "active",
    is_featured: false,
    sort_order: "0",
});

function getApiErrorMessage(error: unknown): string | null {
    if (!error || typeof error !== "object") return null;

    const apiError = error as Record<string, unknown> & {
        data?: unknown;
        error?: unknown;
        message?: unknown;
        status?: unknown;
    };

    const data =
        apiError.data && typeof apiError.data === "object"
            ? (apiError.data as Record<string, unknown>)
            : undefined;
    const errors =
        data?.errors && typeof data.errors === "object"
            ? (data.errors as Record<string, unknown>)
            : undefined;

    const validationMessages = errors
        ? Object.values(errors).flatMap((value) =>
            Array.isArray(value)
                ? value.filter(
                    (item): item is string =>
                        typeof item === "string",
                )
                : typeof value === "string"
                    ? [value]
                    : [],
        )
        : [];

    return (
        validationMessages.join(" ") ||
        (typeof data?.message === "string"
            ? data.message
            : typeof data?.error === "string"
                ? data.error
                : typeof apiError.data === "string"
                    ? apiError.data
                    : null) ||
        (typeof apiError.message === "string"
            ? apiError.message
            : typeof apiError.error === "string"
                ? apiError.error
                : typeof apiError.status === "number"
                    ? `Request failed with status ${apiError.status}.`
                    : null)
    );
}

function getApiErrorDetails(error: unknown) {
    if (!error || typeof error !== "object") {
        return {
            message: error instanceof Error ? error.message : String(error),
        };
    }

    const apiError = error as Record<string, unknown>;
    return {
        status: apiError.status,
        message: apiError.message,
        error: apiError.error,
        data: apiError.data,
    };
}

export default function ProductFormDialog({
    mode,
    open,
    setOpen,
    product,
}: ProductFormDialogProps) {
    const locale = useLocale();
    const isArabic = locale.startsWith("ar");
    const isEditing = mode === "edit";

    const t = useTranslations("products.form");

    const { data: categoriesResponse, isLoading: isLoadingCategories } =
        useGetCategoriesQuery();

    const {
        data: specificationsResponse,
        isLoading: isLoadingSpecifications,
    } = useGetSpecificationsQuery();

    const details = useGetAdminProductQuery(product?.id ?? 0, {
        skip: !open || !isEditing || !product,
    });

    const [createProduct, { isLoading: isCreating }] =
        useCreateProductMutation();

    const [updateProduct, { isLoading: isUpdating }] =
        useUpdateProductMutation();

    const [uploadProductImages, { isLoading: isUploading }] =
        useUploadProductImagesMutation();
    const [deleteProductImage, { isLoading: isDeletingImage }] =
        useDeleteProductImageMutation();

    const [form, setForm] = useState<ProductFormState>(emptyForm());
    const [selectedSpecs, setSelectedSpecs] =
        useState<SelectedSpecification[]>([]);
    const [specificationToAdd, setSpecificationToAdd] = useState("");
    const [files, setFiles] = useState<
        { file: File; previewUrl: string }[]
    >([]);
    const filePreviewUrlsRef = useRef(new Set<string>());

    const [initializedProductId, setInitializedProductId] =
        useState<number | null>(null);

    const currentProduct = details.currentData?.data ?? product ?? null;

    const specificationsLoaded =
        currentProduct !== null &&
        Object.prototype.hasOwnProperty.call(
            currentProduct,
            "specifications",
        );

    const canEditSpecifications =
        !isEditing || specificationsLoaded;

    const categories = categoriesResponse?.data ?? [];
    const specifications = specificationsResponse?.data ?? [];

    const availableSpecifications = specifications.filter(
        (specification) =>
            specification.status === "active" &&
            !selectedSpecs.some(
                (selected) =>
                    selected.specification_id === specification.id,
            ),
    );

    const [selectedColorIds, setSelectedColorIds] = useState<number[]>([]);

    const [updateProductColors, { isLoading: isUpdatingColors }] =
        useUpdateProductColorsMutation();

    const isBusy = isCreating || isUpdating || isUploading || isDeletingImage || isUpdatingColors;

    if (
        open &&
        mode === "edit" &&
        product &&
        details.currentData &&
        initializedProductId !== product.id
    ) {
        const source = details.currentData.data;

        setForm(getProductFormState(source));
        setSelectedSpecs(
            source.specifications === undefined
                ? []
                : getSelectedSpecifications(source.specifications),
        );
        setSelectedColorIds(
            Array.isArray(source.colors ?? product.colors)
                ? (source.colors ?? product.colors ?? []).map((color) => color.id)
                : [],
        );
        setSpecificationToAdd("");
        setInitializedProductId(product.id);
    }

    function clearSelectedFiles() {
        filePreviewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
        filePreviewUrlsRef.current.clear();
        setFiles([]);
    }

    function removeSelectedFile(previewUrl: string) {
        URL.revokeObjectURL(previewUrl);
        filePreviewUrlsRef.current.delete(previewUrl);
        setFiles((previous) =>
            previous.filter((item) => item.previewUrl !== previewUrl),
        );
    }

    useEffect(
        () => () => {
            filePreviewUrlsRef.current.forEach((url) =>
                URL.revokeObjectURL(url),
            );
            filePreviewUrlsRef.current.clear();
        },
        [],
    );

    function updateField<K extends keyof ProductFormState>(
        field: K,
        value: ProductFormState[K],
    ) {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));
    }

    function updateSpecification(
        id: number,
        field: "value_ar" | "value_en",
        value: string,
    ) {
        setSelectedSpecs((previous) =>
            previous.map((specification) =>
                specification.specification_id === id
                    ? { ...specification, [field]: value }
                    : specification,
            ),
        );
    }

    function addSpecification() {
        const id = Number(specificationToAdd);

        if (!id || selectedSpecs.some((item) => item.specification_id === id)) {
            return;
        }

        setSelectedSpecs((previous) => [
            ...previous,
            {
                specification_id: id,
                value_ar: "",
                value_en: "",
                sort_order: previous.length + 1,
            },
        ]);

        setSpecificationToAdd("");
    }

    function removeSpecification(id: number) {
        setSelectedSpecs((previous) =>
            previous
                .filter((item) => item.specification_id !== id)
                .map((item, index) => ({
                    ...item,
                    sort_order: index + 1,
                })),
        );
    }

    function handleOpenChange(nextOpen: boolean) {
        if (isBusy && !nextOpen) return;

        setOpen(nextOpen);

        if (!nextOpen) {
            setForm(emptyForm());
            setSelectedSpecs([]);
            setSelectedColorIds([]);
            setSpecificationToAdd("");
            clearSelectedFiles();
            setInitializedProductId(null);
        }
    }

    async function handleDeleteImage(imageId: number) {
        if (!currentProduct || isBusy) return;

        const confirmed = window.confirm(t("confirmDeleteImage"));
        if (!confirmed) return;

        try {
            await deleteProductImage({
                productId: currentProduct.id,
                imageId,
            }).unwrap();

            await details.refetch();
            toast.success(t("imageDeleted"));
        } catch (error) {
            console.error("Delete product image failed:", getApiErrorDetails(error));
            toast.error(getApiErrorMessage(error) ?? t("deleteImageFailed"));
        }
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isBusy) return;

        if (isEditing && !product) return;

        const price = Number(form.price);
        const salePrice =
            form.sale_price.trim() === ""
                ? null
                : Number(form.sale_price);

        if (
            salePrice !== null &&
            Number.isFinite(price) &&
            salePrice > price
        ) {
            toast.error(t("invalidPrice"));
            return;
        }

        const payload: Omit<ProductPayload, "slug" | "sku"> = {
            category_id: Number(form.category_id),
            name_ar: form.name_ar.trim(),
            name_en: form.name_en.trim(),
            description_ar: form.description_ar.trim() || null,
            description_en: form.description_en.trim() || null,
            price,
            sale_price: salePrice,
            status: form.status,
            is_featured: form.is_featured,
            sort_order: Number(form.sort_order),
        };

        // Do not overwrite existing specifications if the API does not
        // return them when loading the product for editing.
        if (!isEditing || specificationsLoaded) {
            payload.specifications = selectedSpecs.map(
                (specification, index) => ({
                    specification_id: specification.specification_id,
                    value_ar: specification.value_ar.trim() || null,
                    value_en: specification.value_en.trim() || null,
                    sort_order: index + 1,
                }),
            );
        }

        let savedProduct: Product;

        try {
            if (mode === "create") {
                const slug = createSlug(form.name_en);

                if (!slug) {
                    toast.error(t("invalidSlugSource"));
                    return;
                }

                const response = await createProduct({
                    ...payload,
                    slug,
                    sku: null,
                }).unwrap();

                savedProduct = response.data;
            } else {
                const response = await updateProduct({
                    id: product!.id,
                    body: payload,
                }).unwrap();

                savedProduct = response.data;
            }
        } catch (error) {
            console.error("Save product failed:", error);

            toast.error(
                getApiErrorMessage(error) ?? t("saveFailed"),
            );

            return;
        }

        try {
            await updateProductColors({
                id: savedProduct.id,
                color_ids: selectedColorIds,
            }).unwrap();
        } catch (error) {
            console.error(
                "Save product colors failed:",
                getApiErrorDetails(error),
            );
            toast.error(
                getApiErrorMessage(error) ?? t("colorsUpdateFailed"),
            );
            clearSelectedFiles();
            setOpen(false);
            return;
        }

        if (files.length > 0) {
            try {
                await uploadProductImages({
                    productId: savedProduct.id,
                    files: files.map(({ file }) => file),
                }).unwrap();
            } catch (error) {
                console.error(
                    "Upload product images failed:",
                    getApiErrorDetails(error),
                );

                toast.error(
                    getApiErrorMessage(error) ?? t("imageUploadFailed"),
                );
                clearSelectedFiles();
                setOpen(false);
                return;
            }
        }

        toast.success(
            mode === "create" ? t("created") : t("updated"),
        );

        clearSelectedFiles();
        setOpen(false);
    }

    const {
        data: colors = [],
        isLoading: isLoadingColors,
        isError: isColorsError,
        refetch: refetchColors,
    } = useGetPublicColorsQuery();
    const availableColors = (colors ?? []).filter(
        (color) => color.status === "active",
    );
    const existingProductColors =
        currentProduct?.colors ?? product?.colors ?? [];
    const colorsById = new Map(
        availableColors.map((color) => [color.id, color]),
    );

    existingProductColors.forEach((color) => {
        if (!colorsById.has(color.id)) {
            colorsById.set(color.id, color);
        }
    });
    const selectableColors = [...colorsById.values()];

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                dir={isArabic ? "rtl" : "ltr"}
                className="max-h-[90dvh] overflow-y-auto sm:max-w-[850px]"
            >
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? t("editTitle") : t("addTitle")}
                    </DialogTitle>

                    <DialogDescription>
                        {t("description")}
                    </DialogDescription>
                </DialogHeader>

                {isEditing &&
                    !details.currentData &&
                    details.isError &&
                    !details.isFetching ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                        <p className="text-destructive">
                            {t("detailsLoadFailed")}
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => void details.refetch()}
                        >
                            {t("retryDetails")}
                        </Button>
                    </div>
                ) : isEditing &&
                    (!details.currentData ||
                        initializedProductId !== product?.id) ? (
                    <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
                        <Loader2 className="size-5 animate-spin" />
                        {t("loadingDetails")}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <section className="space-y-4">
                            <h3 className="font-semibold">
                                {isArabic ? "بيانات المنتج" : "Product Details"}
                            </h3>

                            <div className="space-y-2">
                                <label htmlFor="product-category" className="text-sm font-medium">
                                    {t("category")}
                                </label>

                                <Select
                                    value={form.category_id || null}
                                    onValueChange={(value: string | null) => {
                                        if (value !== null) {
                                            updateField("category_id", value);
                                        }
                                    }}
                                    required
                                    disabled={isBusy || isLoadingCategories}
                                >
                                    <SelectTrigger
                                        id="product-category"
                                        className="h-11 w-full"
                                    >
                                        <SelectValue
                                            placeholder={
                                                isLoadingCategories
                                                    ? t("loadingCategories")
                                                    : t("chooseCategory")
                                            }
                                        >
                                            {(value: string | null) => {
                                                const selectedCategory =
                                                    categories.find(
                                                        (category) =>
                                                            String(category.id) ===
                                                            value,
                                                    );

                                                if (!selectedCategory) {
                                                    return isLoadingCategories
                                                        ? t("loadingCategories")
                                                        : t("chooseCategory");
                                                }

                                                const imageUrl =
                                                    getPublicAssetUrl(
                                                        selectedCategory
                                                            .gallery_item?.image,
                                                    );

                                                return (
                                                    <span className="flex min-w-0 items-center gap-3">
                                                        <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
                                                            {imageUrl ? (
                                                                <Image
                                                                    src={imageUrl}
                                                                    alt=""
                                                                    width={32}
                                                                    height={32}
                                                                    unoptimized
                                                                    className="size-full object-cover"
                                                                />
                                                            ) : (
                                                                <ImagePlus className="size-4 text-muted-foreground" />
                                                            )}
                                                        </span>
                                                        <span className="truncate">
                                                            {isArabic
                                                                ? selectedCategory.name_ar
                                                                : selectedCategory.name_en}
                                                        </span>
                                                        {selectedCategory.status ===
                                                            "inactive" && (
                                                                <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                                                    {t("inactive")}
                                                                </span>
                                                            )}
                                                    </span>
                                                );
                                            }}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => {
                                            const imageUrl =
                                                getPublicAssetUrl(
                                                    category.gallery_item?.image,
                                                );

                                            return (
                                                <SelectItem
                                                    key={category.id}
                                                    value={String(category.id)}
                                                    className="min-h-12 py-2"
                                                >
                                                    <span className="flex min-w-0 items-center gap-3">
                                                        <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
                                                            {imageUrl ? (
                                                                <Image
                                                                    src={imageUrl}
                                                                    alt=""
                                                                    width={36}
                                                                    height={36}
                                                                    unoptimized
                                                                    className="size-full object-cover"
                                                                />
                                                            ) : (
                                                                <ImagePlus className="size-4 text-muted-foreground" />
                                                            )}
                                                        </span>
                                                        <span className="min-w-0 flex-1 truncate">
                                                            {isArabic
                                                                ? category.name_ar
                                                                : category.name_en}
                                                        </span>
                                                        {category.status ===
                                                            "inactive" && (
                                                                <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                                                    {t("inactive")}
                                                                </span>
                                                            )}
                                                    </span>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="product-name-ar" className="text-sm font-medium">
                                        {t("nameAr")}
                                    </label>
                                    <Input
                                        id="product-name-ar"
                                        value={form.name_ar}
                                        onChange={(event) =>
                                            updateField("name_ar", event.target.value)
                                        }
                                        dir="rtl"
                                        maxLength={255}
                                        required
                                        disabled={isBusy}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="product-name-en" className="text-sm font-medium">
                                        {t("nameEn")}
                                    </label>
                                    <Input
                                        id="product-name-en"
                                        value={form.name_en}
                                        onChange={(event) =>
                                            updateField("name_en", event.target.value)
                                        }
                                        dir="ltr"
                                        maxLength={255}
                                        required
                                        disabled={isBusy}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="product-description-ar" className="text-sm font-medium">
                                        {t("descAr")}
                                    </label>
                                    <Textarea
                                        id="product-description-ar"
                                        value={form.description_ar}
                                        onChange={(event) =>
                                            updateField("description_ar", event.target.value)
                                        }
                                        dir="rtl"
                                        rows={4}
                                        maxLength={10000}
                                        disabled={isBusy}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="product-description-en" className="text-sm font-medium">
                                        {t("descEn")}
                                    </label>
                                    <Textarea
                                        id="product-description-en"
                                        value={form.description_en}
                                        onChange={(event) =>
                                            updateField("description_en", event.target.value)
                                        }
                                        dir="ltr"
                                        rows={4}
                                        maxLength={10000}
                                        disabled={isBusy}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="space-y-2">
                                    <label htmlFor="product-price" className="text-sm font-medium">
                                        {t("price")}
                                    </label>
                                    <Input
                                        id="product-price"
                                        type="number"
                                        min={0}
                                        max={9999999999.99}
                                        step="0.01"
                                        value={form.price}
                                        onChange={(event) =>
                                            updateField("price", event.target.value)
                                        }
                                        required
                                        disabled={isBusy}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="product-sale-price" className="text-sm font-medium">
                                        {t("salePrice")}
                                    </label>
                                    <Input
                                        id="product-sale-price"
                                        type="number"
                                        min={0}
                                        max={9999999999.99}
                                        step="0.01"
                                        value={form.sale_price}
                                        onChange={(event) =>
                                            updateField("sale_price", event.target.value)
                                        }
                                        disabled={isBusy}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="product-sort-order" className="text-sm font-medium">
                                        {t("sortOrder")}
                                    </label>
                                    <Input
                                        id="product-sort-order"
                                        type="number"
                                        min={0}
                                        max={4294967295}
                                        step={1}
                                        value={form.sort_order}
                                        onChange={(event) =>
                                            updateField("sort_order", event.target.value)
                                        }
                                        required
                                        disabled={isBusy}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="product-status" className="text-sm font-medium">
                                        {t("status")}
                                    </label>
                                    <select
                                        id="product-status"
                                        value={form.status}
                                        onChange={(event) =>
                                            updateField(
                                                "status",
                                                event.target.value as "active" | "inactive",
                                            )
                                        }
                                        disabled={isBusy}
                                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                    >
                                        <option value="active">{t("active")}</option>
                                        <option value="inactive">{t("inactive")}</option>
                                    </select>
                                </div>
                            </div>

                            <label className="flex items-center gap-3 rounded-md border p-3">
                                <input
                                    type="checkbox"
                                    checked={form.is_featured}
                                    onChange={(event) =>
                                        updateField("is_featured", event.target.checked)
                                    }
                                    disabled={isBusy}
                                    className="size-4"
                                />
                                <span className="text-sm font-medium">
                                    {t("featured")}
                                </span>
                            </label>
                        </section>

                        <section className="space-y-4 rounded-lg border p-4">
                            <h3 className="font-semibold">
                                {t("specifications")}
                            </h3>

                            {!canEditSpecifications && (
                                <p className="text-sm text-amber-700">
                                    {t("specificationsUnavailable")}
                                </p>
                            )}

                            {canEditSpecifications && (
                                <>
                                    <div className="flex flex-col gap-2 sm:flex-row">
                                        <select
                                            value={specificationToAdd}
                                            onChange={(event) =>
                                                setSpecificationToAdd(event.target.value)
                                            }
                                            disabled={isBusy || isLoadingSpecifications}
                                            className="h-10 min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-sm"
                                        >
                                            <option value="">
                                                {isLoadingSpecifications
                                                    ? t("loadingSpecifications")
                                                    : t("chooseSpecification")}
                                            </option>

                                            {availableSpecifications.map((specification) => (
                                                <option
                                                    key={specification.id}
                                                    value={specification.id}
                                                >
                                                    {isArabic
                                                        ? specification.name_ar
                                                        : specification.name_en}
                                                    {specification.unit
                                                        ? ` (${specification.unit})`
                                                        : ""}
                                                </option>
                                            ))}
                                        </select>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={addSpecification}
                                            disabled={isBusy || !specificationToAdd}
                                        >
                                            <Plus className="size-4" />
                                            {t("addSpecification")}
                                        </Button>
                                    </div>

                                    {selectedSpecs.length === 0 && (
                                        <p className="text-sm text-muted-foreground">
                                            {t("noSpecifications")}
                                        </p>
                                    )}

                                    <div className="space-y-3">
                                        {selectedSpecs.map((selected) => {
                                            const definition = specifications.find(
                                                (item) => item.id === selected.specification_id,
                                            );

                                            const name = definition
                                                ? isArabic
                                                    ? definition.name_ar
                                                    : definition.name_en
                                                : `#${selected.specification_id}`;

                                            return (
                                                <div
                                                    key={selected.specification_id}
                                                    className="space-y-3 rounded-md bg-muted/40 p-3"
                                                >
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className="font-medium">
                                                            {name}
                                                            {definition?.unit
                                                                ? ` (${definition.unit})`
                                                                : ""}
                                                        </div>

                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                removeSpecification(
                                                                    selected.specification_id,
                                                                )
                                                            }
                                                            disabled={isBusy}
                                                        >
                                                            <X className="size-4" />
                                                            {t("remove")}
                                                        </Button>
                                                    </div>

                                                    <div className="grid gap-3 sm:grid-cols-2">
                                                        <Input
                                                            value={selected.value_ar}
                                                            onChange={(event) =>
                                                                updateSpecification(
                                                                    selected.specification_id,
                                                                    "value_ar",
                                                                    event.target.value,
                                                                )
                                                            }
                                                            placeholder={t("valueAr")}
                                                            dir="rtl"
                                                            maxLength={10000}
                                                            disabled={isBusy}
                                                        />

                                                        <Input
                                                            value={selected.value_en}
                                                            onChange={(event) =>
                                                                updateSpecification(
                                                                    selected.specification_id,
                                                                    "value_en",
                                                                    event.target.value,
                                                                )
                                                            }
                                                            placeholder={t("valueEn")}
                                                            dir="ltr"
                                                            maxLength={10000}
                                                            disabled={isBusy}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </section>


                        <section className="space-y-4 rounded-lg border p-4">
                            <div className="space-y-1">
                                <h3 className="font-semibold">
                                    {isArabic ? "ألوان المنتج" : "Product Colors"}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {isArabic
                                        ? "اختر لونًا واحدًا أو أكثر لهذا المنتج"
                                        : "Select one or more colors for this product"}
                                </p>
                            </div>

                            {isLoadingColors && (
                                <p className="text-sm text-muted-foreground">
                                    {isArabic
                                        ? "جاري تحميل الألوان..."
                                        : "Loading colors..."}
                                </p>
                            )}

                            {isColorsError && (
                                <div
                                    role="alert"
                                    className="flex flex-wrap items-center gap-2 text-sm text-destructive"
                                >
                                    <span>
                                        {isArabic
                                            ? "تعذر تحميل الألوان المتاحة."
                                            : "Could not load available colors."}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => void refetchColors()}
                                    >
                                        {isArabic ? "إعادة المحاولة" : "Retry"}
                                    </Button>
                                </div>
                            )}

                            {selectableColors.length === 0 &&
                                !isLoadingColors &&
                                !isColorsError && (
                                    <p className="text-sm text-muted-foreground">
                                        {isArabic
                                            ? "لا توجد ألوان متاحة"
                                            : "No colors available"}
                                    </p>
                                )}

                            {selectableColors.length > 0 && (
                                <div className="flex flex-wrap gap-3">
                                    {selectableColors.map((color) => {
                                        const selected = selectedColorIds.includes(color.id);
                                        const label = isArabic ? color.name_ar : color.name_en;

                                        return (
                                            <button
                                                key={color.id}
                                                type="button"
                                                disabled={isBusy || isUpdatingColors}
                                                onClick={() => {
                                                    setSelectedColorIds((previous) =>
                                                        previous.includes(color.id)
                                                            ? previous.filter((id) => id !== color.id)
                                                            : [...previous, color.id]
                                                    );
                                                }}
                                                title={`${label} (${color.hex})`}
                                                aria-pressed={selected}
                                                aria-label={label}
                                                className={`flex size-9 items-center justify-center rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed ${selected
                                                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                                                    : "ring-1 ring-border hover:ring-primary/50"
                                                    }`}
                                            >
                                                <span
                                                    className="flex size-7 items-center justify-center rounded-full"
                                                    style={{ backgroundColor: color.hex }}
                                                >
                                                    {selected && (
                                                        <Check
                                                            className="size-4 text-white mix-blend-difference"
                                                            strokeWidth={3}
                                                        />
                                                    )}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            <p className="text-xs text-muted-foreground">
                                {isArabic
                                    ? `تم اختيار ${selectedColorIds.length} لون`
                                    : `${selectedColorIds.length} colors selected`}
                            </p>
                        </section>


                        <section className="space-y-4 rounded-lg border p-4">
                            <h3 className="font-semibold">{t("images")}</h3>

                            {currentProduct?.images &&
                                currentProduct.images.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-sm text-muted-foreground">
                                            {t("existingImages")}
                                        </p>

                                        <div className="flex flex-wrap gap-3">
                                            {currentProduct.images.map((image) => {
                                                const imageUrl =
                                                    getPublicAssetUrl(image.url);

                                                return (
                                                    <div
                                                        key={image.id}
                                                        className="relative size-20 overflow-hidden rounded-md border bg-muted"
                                                    >
                                                        {imageUrl ? (
                                                            <Image
                                                                src={imageUrl}
                                                                alt={
                                                                    image.alt_text ||
                                                                    t("imageAlt")
                                                                }
                                                                width={80}
                                                                height={80}
                                                                unoptimized
                                                                className="size-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex size-full items-center justify-center text-muted-foreground">
                                                                <ImagePlus className="size-6" />
                                                            </div>
                                                        )}

                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="icon"
                                                            className="absolute end-1 top-1 size-7 rounded-full shadow"
                                                            aria-label={t("deleteImage")}
                                                            title={t("deleteImage")}
                                                            disabled={isBusy}
                                                            onClick={() => handleDeleteImage(image.id)}
                                                        >
                                                            {isDeletingImage ? (
                                                                <Loader2 className="size-4 animate-spin" />
                                                            ) : (
                                                                <Trash2 className="size-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                            <input
                                id="product-images"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                multiple
                                className="hidden"
                                disabled={isBusy}
                                onChange={(event) => {
                                    const input = event.currentTarget;
                                    const selectedFiles = Array.from(
                                        input.files ?? [],
                                    ).map((file) => {
                                        const previewUrl =
                                            URL.createObjectURL(file);
                                        filePreviewUrlsRef.current.add(
                                            previewUrl,
                                        );

                                        return { file, previewUrl };
                                    });
                                    setFiles((previous) => [
                                        ...previous,
                                        ...selectedFiles,
                                    ]);
                                    input.value = "";
                                }}
                            />

                            <label
                                htmlFor="product-images"
                                className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/30 px-6 py-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/60 ${isBusy ? "pointer-events-none opacity-60" : ""
                                    }`}
                            >
                                <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <ImagePlus className="size-6" />
                                </span>
                                <span className="space-y-1">
                                    <span className="block text-sm font-semibold">
                                        {t("chooseImages")}
                                    </span>
                                    <span className="block text-xs text-muted-foreground">
                                        {t("imagePickerHint")}
                                    </span>
                                    <span className="block text-xs text-muted-foreground">
                                        {t("imagePickerFormats")}
                                    </span>
                                </span>
                            </label>

                            {files.length > 0 && (
                                <div className="space-y-3">
                                    <p className="text-sm font-medium">
                                        {t("selectedImages")}
                                    </p>

                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                                        {files.map(({ file, previewUrl }) => (
                                            <div
                                                key={previewUrl}
                                                className="overflow-hidden rounded-lg border bg-card"
                                            >
                                                <div className="relative aspect-square bg-muted">
                                                    <Image
                                                        src={previewUrl}
                                                        alt={file.name}
                                                        fill
                                                        unoptimized
                                                        className="object-cover"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        size="icon"
                                                        className="absolute end-2 top-2 size-8 rounded-full shadow-sm"
                                                        aria-label={`${t("remove")}: ${file.name}`}
                                                        onClick={() =>
                                                            removeSelectedFile(
                                                                previewUrl,
                                                            )
                                                        }
                                                        disabled={isBusy}
                                                    >
                                                        <X className="size-4" />
                                                    </Button>
                                                </div>
                                                <p
                                                    className="truncate px-2 py-2 text-xs text-muted-foreground"
                                                    title={file.name}
                                                >
                                                    {file.name}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleOpenChange(false)}
                                disabled={isBusy}
                            >
                                {t("cancel")}
                            </Button>

                            <Button
                                type="submit"
                                disabled={
                                    isBusy ||
                                    isLoadingCategories ||
                                    (isEditing &&
                                        (!details.currentData ||
                                            initializedProductId !==
                                            product?.id))
                                }
                            >
                                {isBusy && (
                                    <Loader2 className="size-4 animate-spin" />
                                )}

                                {isBusy
                                    ? t("saving")
                                    : isEditing
                                        ? t("save")
                                        : t("create")}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
