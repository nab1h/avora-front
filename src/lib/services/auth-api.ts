import { api } from "./api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // -------------------
    // forget Password
    // -------------------
    forgotPassword: builder.mutation<
      { message: string },
      { email: string }
    >({
      query: (data) => ({
        url: "/forgot-password",
        method: "POST",
        body: data,
      }),
    }),


    // -------------------
    // Reset Password
    // -------------------
    resetPassword: builder.mutation<
      { message: string },
      {
        token: string;
        email: string;
        password: string;
        password_confirmation: string;
      }
    >({
      query: (data) => ({
        url: "/reset-password",
        method: "POST",
        body: data,
      }),
    }),


    // -------------------
    // Get Me 
    // -------------------
    getMe: builder.query<
      {
        user: {
          id: number;
          name: string;
          email: string;
          roles: any[];
          permissions: any[];
        };
      },
      void
    >({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
    }),

    
  }),
});


export const {
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetMeQuery,
} = authApi;