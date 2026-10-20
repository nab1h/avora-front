
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");

      headers.set("Accept", "application/json");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  tagTypes: [
    "Roles",
    "Permissions",
    "Users",
    "Services",
    "Gallery",
    "SocialLinks",
    "Settings",
    "Content",
    "SeoPage",
    "SiteScripts",
    "Analytics",
    "Categories",
    "Specifications"
  ],

  endpoints: (builder) => ({
    getAnalytics: builder.query<AnalyticsResponse, void>({
      query: () => "/admin/analytics",
      providesTags: ["Analytics"],
    }),
  }),
});

export interface AnalyticsResponse {
  data: {
    total_views: number;
    unique_visitors: number;
    total_sessions: number;
    today_views: number;
    today_visitors: number;
    daily_views: {
      date: string;
      views: number;
    }[];
    top_pages: {
      page_path: string;
      views: number;
    }[];
  };
}

export const { useGetAnalyticsQuery } = api;
