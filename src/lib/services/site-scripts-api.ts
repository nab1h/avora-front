import { api } from "./api";

export type SiteScriptType = "analytics" | "pixel" | "verification" | "custom";
export type SiteScriptPlacement = "head" | "body_start" | "body_end";
export type SiteScriptStrategy = "beforeInteractive" | "afterInteractive" | "lazyOnload";

export interface SiteScript {
  id: number;
  name: string;
  type: SiteScriptType;
  url: string | null;
  code: string | null;
  placement: SiteScriptPlacement;
  strategy: SiteScriptStrategy;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SiteScriptPayload {
  name: string;
  type: SiteScriptType;
  url?: string | null;
  code?: string | null;
  placement: SiteScriptPlacement;
  strategy: SiteScriptStrategy;
  is_active: boolean;
  sort_order: number;
}

interface SiteScriptsResponse {
  data: SiteScript[];
}

export const siteScriptsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSiteScripts: builder.query<SiteScript[], void>({
      query: () => ({
        url: "/admin/site-scripts",
        method: "GET",
      }),
      transformResponse: (response: SiteScriptsResponse | SiteScript[]) => {
        if (Array.isArray(response)) {
          return response;
        }

        return response?.data ?? [];
      },
      providesTags: ["SiteScripts"],
    }),

    getSiteScript: builder.query<SiteScript, number>({
      query: (id) => ({
        url: `/admin/site-scripts/${id}`,
        method: "GET",
      }),
      transformResponse: (response: { data?: SiteScript } | SiteScript) => {
        if (response && typeof response === "object" && "data" in response) {
          return response.data ?? (response as SiteScript);
        }

        return response as SiteScript;
      },
      providesTags: (_result, _error, id) => [{ type: "SiteScripts", id }],
    }),

    createSiteScript: builder.mutation<SiteScript, SiteScriptPayload>({
      query: (body) => ({
        url: "/admin/site-scripts",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SiteScripts"],
    }),

    updateSiteScript: builder.mutation<SiteScript, { id: number; data: SiteScriptPayload }>({
      query: ({ id, data }) => ({
        url: `/admin/site-scripts/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["SiteScripts"],
    }),

    deleteSiteScript: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/site-scripts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SiteScripts"],
    }),
  }),
});

export const {
  useGetSiteScriptsQuery,
  useGetSiteScriptQuery,
  useCreateSiteScriptMutation,
  useUpdateSiteScriptMutation,
  useDeleteSiteScriptMutation,
} = siteScriptsApi;
