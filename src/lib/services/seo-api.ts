import { api } from './api'

export type SeoPage = {
  id: number
  page: string
  title: string | null
  description: string | null
  keywords: string | null
  og_title: string | null
  og_description: string | null
  og_image: string | null
  robots: string | null
  canonical_url: string | null
  created_at: string
  updated_at: string
}

export type SeoPageInput = {
  page: string
  title: string
  description: string
  keywords: string
  og_title: string
  og_description: string
  og_image: File | null
  robots: string
  canonical_url: string
}

type SeoPagesResponse = {
  data: SeoPage[]
}

type SeoPageResponse = {
  data: SeoPage
}

function toFormData(data: SeoPageInput) {
  const formData = new FormData()

  formData.append('page', data.page)
  formData.append('title', data.title)
  formData.append('description', data.description)
  formData.append('keywords', data.keywords)
  formData.append('og_title', data.og_title)
  formData.append('og_description', data.og_description)
  formData.append('robots', data.robots)
  formData.append('canonical_url', data.canonical_url)

  if (data.og_image) {
    formData.append('og_image', data.og_image)
  }

  return formData
}

export const seoApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSeoPages: builder.query<SeoPagesResponse, void>({
      query: () => '/admin/seo-pages',
      providesTags: (result) => [
        { type: 'SeoPage', id: 'LIST' },
        ...(result?.data ?? []).map(({ id }) => ({ type: 'SeoPage' as const, id })),
      ],
    }),

    getSeoPage: builder.query<SeoPageResponse, number>({
      query: (id) => `/admin/seo-pages/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'SeoPage', id }],
    }),

    createSeoPage: builder.mutation<SeoPageResponse, SeoPageInput>({
      query: (data) => ({
        url: '/admin/seo-pages',
        method: 'POST',
        body: toFormData(data),
      }),
      invalidatesTags: [{ type: 'SeoPage', id: 'LIST' }],
    }),

    updateSeoPage: builder.mutation<SeoPageResponse, { id: number; data: SeoPageInput }>({
      query: ({ id, data }) => {
        const formData = toFormData(data)
        formData.append('_method', 'PUT')

        return {
          url: `/admin/seo-pages/${id}`,
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'SeoPage', id },
        { type: 'SeoPage', id: 'LIST' },
      ],
    }),

    deleteSeoPage: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/admin/seo-pages/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'SeoPage', id },
        { type: 'SeoPage', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetSeoPagesQuery,
  useGetSeoPageQuery,
  useCreateSeoPageMutation,
  useUpdateSeoPageMutation,
  useDeleteSeoPageMutation,
} = seoApi