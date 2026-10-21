import { api } from "./api";

// =========================
// Color types
// =========================

export interface Color {
    id: number;
    name_ar: string;
    name_en: string;
    hex: string;
    sort_order: number;
    status: "active" | "inactive";
    created_at?: string | null;
    updated_at?: string | null;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
}

export interface PaginationLinks {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
}

export interface PaginationMeta {
    current_page: number;
    from: number | null;
    last_page: number;
    links: PaginationLink[];
    path: string;
    per_page: number;
    to: number | null;
    total: number;
}

export interface ColorsResponse {
    data: Color[];
    links: PaginationLinks;
    meta: PaginationMeta;
    success: boolean;
    message: string;
}

export interface ColorResponse {
    data: Color;
    success: boolean;
    message: string;
}

export interface DeleteColorResponse {
    success: boolean;
    message: string;
}

// =========================
// Create / Update payloads
// =========================

export interface CreateColorPayload {
    name_ar: string;
    name_en: string;
    hex: string;
    status: "active" | "inactive";
    sort_order: number;
}

export type UpdateColorPayload = CreateColorPayload;

// =========================
// Colors API
// =========================

export const colorsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // Get colors (admin - paginated)
        getColors: builder.query<ColorsResponse, void>({
            query: () => ({
                url: "/admin/colors",
                method: "GET",
            }),
            providesTags: ["Colors"],
        }),

        // Get public colors (storefront - flat list, no pagination)
        getPublicColors: builder.query<Color[], void>({
            query: () => ({
                url: "/colors",
                method: "GET",
            }),
            transformResponse: (response: { data: Color[]; success: boolean; message: string }) =>
                response.data ?? [],
            providesTags: ["Colors"],
        }),

        // Get a single color by id
        getColor: builder.query<ColorResponse, number>({
            query: (id) => ({
                url: `/admin/colors/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: "Colors", id }],
        }),

        // Create color
        createColor: builder.mutation<ColorResponse, CreateColorPayload>({
            query: (body) => ({
                url: "/admin/colors",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Colors"],
        }),

        // Update color
        editColor: builder.mutation<ColorResponse, { id: number; body: UpdateColorPayload }>({
            query: ({ id, body }) => ({
                url: `/admin/colors/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Colors"],
        }),

        // Delete color
        deleteColor: builder.mutation<DeleteColorResponse, number>({
            query: (id) => ({
                url: `/admin/colors/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Colors"],
        }),
    }),
});

export const {
    useGetColorsQuery,
    useGetPublicColorsQuery,
    useGetColorQuery,
    useCreateColorMutation,
    useEditColorMutation,
    useDeleteColorMutation,
} = colorsApi;