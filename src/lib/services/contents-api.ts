import { api } from "./api";
import type { Gallery } from "./gallery";



export type ContentType =
  | "text"
  | "textarea"
  | "image"
  | "url"
  | "number"
  | "boolean";

type Content = {
  id: number
  page: string
  section: string
  key: string
  value: string | null
  type: 'text' | 'textarea' | 'image' | 'url' | 'number' | 'boolean'
  gallery_id: number | null
  gallery_item?: Pick<Gallery, 'id' | 'image'> | null
  sort_order: number
}

type ContentResponse = {
  data: Content[]
}

type CreateContentRequest = {
  page: string;
  section: string;
  key: string;
  value?: string | null;
  type: ContentType;
  gallery_id?: number | null;
  sort_order?: number;
};

type UpdateContentRequest = {
  id: number;
  value?: string | null;
  gallery_id?: number | null;
  sort_order?: number;
};

type ContentMutationResponse = {
  message: string;
  data: Content;
};

// public content types
export type ContentPublic = {
  id: number;
  page: string;
  section: string;
  key: string;
  value: string | null;
  type: ContentType;
  gallery_id: number | null;
  gallery: {
    id: number;
    image: string;
  } | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type PublicContentsResponse = {
  data: ContentPublic[];
};
// ===========================

export const contentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getContentPages: builder.query<{ data: string[] }, void>({
      query: () => ({
        url: "/admin/contents/pages",
        method: "GET",
      }),
      providesTags: ["Content"],
    }),

    getContents: builder.query<ContentResponse, { page: string }>({
      query: ({ page }) => ({
        url: '/admin/contents',
        method: 'GET',
        params: {
          page,
        },
      }),
      providesTags: ['Content'],
    }),

    createContent: builder.mutation<
      ContentMutationResponse,
      CreateContentRequest
    >({
      query: ({ page, section, key, value, type, gallery_id, sort_order }) => ({
        url: "/admin/contents",
        method: "POST",
        body: {
          page,
          section,
          key,
          value: value ?? '',
          type,
          gallery_id: gallery_id ?? null,
          sort_order: sort_order ?? 0,
        },
      }),
      invalidatesTags: ["Content"],
    }),

    updateContent: builder.mutation<
      ContentMutationResponse,
      UpdateContentRequest
    >({
      query: ({ id, value, gallery_id, sort_order }) => ({
        url: `/admin/contents/${id}`,
        method: "PUT",
        body: {
          ...(value !== undefined ? { value } : {}),
          ...(gallery_id !== undefined ? { gallery_id } : {}),
          ...(sort_order !== undefined ? { sort_order } : {}),
        },
      }),
      invalidatesTags: ["Content"],
    }),

    deleteContent: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/admin/contents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Content"],
    }),

    getPublicContents: builder.query<
      PublicContentsResponse,
      string
    >({
      query: (page) => ({
        url: `/contents/${page}`,
        method: "GET",
      }),
    }),


  }),
});

export const {
  useGetContentPagesQuery,
  useGetContentsQuery,
  useCreateContentMutation,
  useUpdateContentMutation,
  useDeleteContentMutation,
  useGetPublicContentsQuery,
} = contentApi;