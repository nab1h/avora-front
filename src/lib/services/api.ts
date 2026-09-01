import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/lib/store';

export const api = createApi({
  reducerPath: 'api',

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,

    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;

      headers.set('Accept', 'application/json');

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),

  endpoints: () => ({}),
});