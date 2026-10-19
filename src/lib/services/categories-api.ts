
import { api } from "./api";

// =========================
// Category types
// =========================

export interface GalleryImage {
  id: number;
  image: string;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Category {
  id: number;
  name_ar: string;
  name_en: string;
  slug: string;
  description_ar: string | null;
  description_en: string | null;
  status: "active" | "inactive";
  sort_order: number;

  gallery_item_id: number | null;
  gallery_item: GalleryImage | null;
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

export interface CategoriesResponse {
  data: Category[];
  links: PaginationLinks;
  meta: PaginationMeta;
  success: boolean;
  message: string;
}

export interface CategoryResponse {
  data: Category;
  success: boolean;
  message: string;
}

export interface DeleteCategoryResponse {
  success: boolean;
  message: string;
}

// =========================
// Create / Update payloads
// =========================

export interface CreateCategoryPayload {
  name_ar: string;
  name_en: string;
  slug: string;
  description_ar: string | null;
  description_en: string | null;
  status: "active" | "inactive";
  sort_order: number;
  gallery_item_id: number | null;
}

export type UpdateCategoryPayload = CreateCategoryPayload;

// =========================
// Categories API
// =========================

export const categoriesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get categories
    getCategories: builder.query<CategoriesResponse, void>({
      query: () => ({
        url: "/admin/categories",
        method: "GET",
      }),
      providesTags: ["Categories"],
    }),

    // Get images from the existing admin gallery
    getGalleryImages: builder.query<GalleryImage[], void>({
      query: () => ({
        url: "/admin/gallery",
        method: "GET",
      }),
    }),

    // Create category
    createCategory: builder.mutation<
      CategoryResponse,
      CreateCategoryPayload
    >({
      query: (body) => ({
        url: "/admin/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Categories"],
    }),

    // Update category
    editCategory: builder.mutation<
      CategoryResponse,
      {
        id: number;
        body: UpdateCategoryPayload;
      }
    >({
      query: ({ id, body }) => ({
        url: `/admin/categories/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Categories"],
    }),

    // Delete category
    deleteCategory: builder.mutation<
      DeleteCategoryResponse,
      number
    >({
      query: (id) => ({
        url: `/admin/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetGalleryImagesQuery,
  useCreateCategoryMutation,
  useEditCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
