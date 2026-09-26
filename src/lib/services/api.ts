import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");

      headers.set('Accept', 'application/json');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),


  tagTypes: [
        "Roles",
        "Permissions",
        "Users",
        "Services"
    ],
  endpoints: () => ({}),
});