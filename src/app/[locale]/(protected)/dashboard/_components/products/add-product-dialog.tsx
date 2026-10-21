
"use client";

import type { Dispatch, SetStateAction } from "react";

import ProductFormDialog from "./product-form-dialog";

interface AddProductDialogProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function AddProductDialog({
    open,
    setOpen,
}: AddProductDialogProps) {
    return (
        <ProductFormDialog
            key={`create:${open}`}
            mode="create"
            open={open}
            setOpen={setOpen}
        />
    );
}
