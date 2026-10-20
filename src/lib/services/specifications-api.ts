
import { api } from "./api";

export interface Specification {
  id: number;
  spec_key: string;
  name_ar: string;
  name_en: string;
  unit: string | null;
  sort_order: number;
  status: "active" | "inactive";
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

export interface SpecificationsResponse {
  data: Specification[];
  links: PaginationLinks;
  meta: PaginationMeta;
  success: boolean;
  message: string;
}

export interface SpecificationResponse {
  data: Specification;
  success: boolean;
  message: string;
}

export interface DeleteSpecificationResponse {
  success: boolean;
  message: string;
}

export interface CreateSpecificationPayload {
  spec_key: string;
  name_ar: string;
  name_en: string;
  unit: string | null;
  sort_order: number;
  status: "active" | "inactive";
}

export type UpdateSpecificationPayload =
  Partial<CreateSpecificationPayload>;

export const specificationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSpecifications: builder.query<
      SpecificationsResponse,
      void
    >({
      query: () => ({
        url: "/admin/specifications",
        method: "GET",
      }),
      providesTags: ["Specifications"],
    }),

    getSpecification: builder.query<
      SpecificationResponse,
      number
    >({
      query: (id) => ({
        url: `/admin/specifications/${id}`,
        method: "GET",
      }),
      providesTags: ["Specifications"],
    }),

    createSpecification: builder.mutation<
      SpecificationResponse,
      CreateSpecificationPayload
    >({
      query: (body) => ({
        url: "/admin/specifications",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Specifications"],
    }),

    editSpecification: builder.mutation<
      SpecificationResponse,
      {
        id: number;
        body: UpdateSpecificationPayload;
      }
    >({
      query: ({ id, body }) => ({
        url: `/admin/specifications/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Specifications"],
    }),

    deleteSpecification: builder.mutation<
      DeleteSpecificationResponse,
      number
    >({
      query: (id) => ({
        url: `/admin/specifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Specifications"],
    }),
  }),
});

export const {
  useGetSpecificationsQuery,
  useGetSpecificationQuery,
  useCreateSpecificationMutation,
  useEditSpecificationMutation,
  useDeleteSpecificationMutation,
} = specificationsApi;
