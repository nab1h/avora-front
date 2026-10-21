
"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useLocale } from "next-intl";

import { Button } from "@/components/ui/button";

import type { Product } from "@/lib/services/products-api";

import ProductsTable from "../_components/products/products-table";
import AddProductDialog from "../_components/products/add-product-dialog";
import EditProductDialog from "../_components/products/edit-product-dialog";

export default function ProductsPage() {
    const locale = useLocale();
    const isArabic = locale.startsWith("ar");

    const [isAddProductOpen, setIsAddProductOpen] =
        useState(false);

    const [isEditProductOpen, setIsEditProductOpen] =
        useState(false);

    const [productToEdit, setProductToEdit] =
        useState<Product | null>(null);

    function handleEditProduct(product: Product) {
        setProductToEdit(product);
        setIsEditProductOpen(true);
    }

    return (
        <div className="flex w-full flex-col gap-6 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1 text-start">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        {isArabic ? "المنتجات" : "Products"}
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        {isArabic
                            ? "إدارة المنتجات والأسعار والصور والمواصفات الفنية."
                            : "Manage products, prices, images, and technical specifications."}
                    </p>
                </div>

                <Button
                    onClick={() => setIsAddProductOpen(true)}
                >
                    <Plus className="size-4" />
                    {isArabic ? "إضافة منتج" : "Add Product"}
                </Button>
            </div>

            <ProductsTable onEdit={handleEditProduct} />

            <AddProductDialog
                open={isAddProductOpen}
                setOpen={setIsAddProductOpen}
            />

            <EditProductDialog
                open={isEditProductOpen}
                setOpen={setIsEditProductOpen}
                product={productToEdit}
            />
        </div>
    );
}
