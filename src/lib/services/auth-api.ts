import { api } from "./api";

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
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
    }),
});




export const {
    useForgotPasswordMutation,
    useResetPasswordMutation,
} = authApi;