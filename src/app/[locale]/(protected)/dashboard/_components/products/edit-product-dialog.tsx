
"use client";

import type { Dispatch, SetStateAction } from "react";

import {
    type Product,
} from "@/lib/services/products-api";

import ProductFormDialog from "./product-form-dialog";

interface EditProductDialogProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    product: Product | null;
}

export default function EditProductDialog({
    open,
    setOpen,
    product,
}: EditProductDialogProps) {
    if (!product) return null;

    return (
        <ProductFormDialog
            key={`${product.id}:${open}`}
            mode="edit"
            open={open}
            setOpen={setOpen}
            product={product}
        />
    );
}
