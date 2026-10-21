
import { api } from "./api";

export interface ProductCategory {
    id: number;
    name_ar: string;
    name_en: string;
    slug: string;
}

export interface ProductImage {
    id: number;
    image_path: string;
    url: string;
    alt_text: string | null;
    sort_order: number;
}

export interface ProductSpecificationValue {
    id: number;
    specification_id: number;
    value_ar: string | null;
    value_en: string | null;
    sort_order: number;
    specification?: {
        id: number;
        spec_key: string;
        name_ar: string;
        name_en: string;
        unit: string | null;
    };
}

export interface ProductColor {
    id: number;
    name_ar: string;
    name_en: string;
    hex: string;
    sort_order: number;
    status: "active" | "inactive";
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: number;
    category_id: number;
    name_ar: string;
    name_en: string;
    slug: string;
    sku: string | null;
    description_ar: string | null;
    description_en: string | null;
    price: string;
    sale_price: string | null;
    status: "active" | "inactive";
    is_featured: boolean;
    sort_order: number;
    category?: ProductCategory;
    images: ProductImage[];
    specifications?: ProductSpecificationValue[];
    colors?: ProductColor[];
}

export interface ProductSpecificationInput {
    specification_id: number;
    value_ar?: string | null;
    value_en?: string | null;
    sort_order?: number;
}

export interface ProductPayload {
    category_id: number;
    name_ar: string;
    name_en: string;
    slug: string;
    sku?: string | null;
    description_ar?: string | null;
    description_en?: string | null;
    price: number;
    sale_price?: number | null;
    status?: "active" | "inactive";
    is_featured?: boolean;
    sort_order?: number;
    specifications?: ProductSpecificationInput[];
}

export interface ProductItemResponse {
    data: Product;
    success: boolean;
    message: string;
}

export interface ProductsResponse {
    data: Product[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number | null;
        last_page: number;
        per_page: number;
        to: number | null;
        total: number;
    };
    success: boolean;
    message: string;
}

export interface DeleteProductResponse {
    success: boolean;
    message: string;
}

export const productsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAdminProducts: builder.query<
            ProductsResponse,
            { page?: number } | void
        >({
            query: (params) => ({
                url: "/admin/products",
                method: "GET",
                params: params?.page
                    ? { page: params.page }
                    : undefined,
            }),
            providesTags: (result) =>
                result
                    ? [
                        { type: "Products", id: "LIST" },
                        ...result.data.map(({ id }) => ({
                            type: "Products" as const,
                            id,
                        })),
                    ]
                    : [{ type: "Products", id: "LIST" }],
        }),

        getAdminProduct: builder.query<ProductItemResponse, number>({
            query: (id) => ({
                url: `/admin/products/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [
                { type: "Products", id },
            ],
        }),

        createProduct: builder.mutation<
            ProductItemResponse,
            ProductPayload
        >({
            query: (body) => ({
                url: "/admin/products",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Products", id: "LIST" }],
        }),

        updateProduct: builder.mutation<
            ProductItemResponse,
            { id: number; body: Partial<ProductPayload> }
        >({
            query: ({ id, body }) => ({
                url: `/admin/products/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Products", id },
                { type: "Products", id: "LIST" },
            ],
        }),

        deleteProduct: builder.mutation<
            DeleteProductResponse,
            number
        >({
            query: (id) => ({
                url: `/admin/products/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: "Products", id },
                { type: "Products", id: "LIST" },
            ],
        }),


        uploadProductImages: builder.mutation<
            unknown,
            { productId: number; files: File[] }
        >({
            query: ({ productId, files }) => {
                const formData = new FormData();

                files.forEach((file) => {
                    formData.append("images[]", file);
                });

                return {
                    url: `/products/${productId}/images`,
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: (_result, _error, { productId }) => [
                { type: "Products", id: productId },
                { type: "Products", id: "LIST" },
            ],
        }),


        deleteProductImage: builder.mutation<
            unknown,
            { productId: number; imageId: number }
        >({
            query: ({ productId, imageId }) => ({
                url: `/products/${productId}/images/${imageId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, { productId }) => [
                { type: "Products", id: productId },
                { type: "Products", id: "LIST" },
            ],
        }),

        updateProductColors: builder.mutation<
            ProductItemResponse,
            { id: number; color_ids: number[] }
        >({
            query: ({ id, color_ids }) => ({
                url: `/admin/products/${id}`,
                method: "PUT",
                body: { color_ids },
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Products", id },
                { type: "Products", id: "LIST" },
            ],
        }),

    }),
});

export const {
    useGetAdminProductsQuery,
    useGetAdminProductQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useUploadProductImagesMutation,
    useDeleteProductImageMutation,
    useUpdateProductColorsMutation,
} = productsApi;
