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
        data: {
          id: number;
          name: string;
          email: string;
          has_password: boolean;
          email_verified_at: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
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
      providesTags: ["User"],

    }),


    verifyEmail: builder.mutation({
      query: ({ id, hash, expires, signature }) => ({
        url: `/email/verify/${id}/${hash}`,
        method: "GET",
        params: {
          expires,
          signature,
        },
      }),
      invalidatesTags: ["User"],
    }),


  }),
});


export const {
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useVerifyEmailMutation,
} = authApi;