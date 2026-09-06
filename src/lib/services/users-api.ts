import { User, UsersResponse } from "@/types/users";
import { api } from "./api";

interface UsersParams {

    page?: number;

    per_page?: number;

    search?: string;

    role?: string;

    permission?: string;

    sort?: string;

}


export const usersApi = api.injectEndpoints({
    endpoints: (builder) => ({


        getUsers: builder.query<
            UsersResponse,
            UsersParams
        >({
            query: (params) => ({

                url: "/users",

                params

            }),

            providesTags: ["Users"]

        }),

        createUser: builder.mutation<
            User,
            {
                name: string;
                email: string;
                password: string;
                password_confirmation: string;
            }
        >({
            query: (body) => ({
                url: "/users",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Users"],
        }),

        //----------
        // upddateUser
        // ---------
        updateUser: builder.mutation<
            User,
            {
                id: number;
                name: string;
                email: string;
                password?: string;
            }
        >({

            query: ({ id, ...body }) => ({

                url: `/users/${id}`,

                method: "PUT",

                body

            }),


            invalidatesTags: ["Users"],

        }),



        updateUserRoles: builder.mutation<
            User,
            {
                id: number;
                roles: number[];
            }
        >({
            query: ({ id, roles }) => ({

                url: `/users/${id}/roles`,

                method: "POST",

                body: {
                    roles
                }

            }),

            invalidatesTags: ["Users"]

        }),



        updateUserPermissions: builder.mutation<
            User,
            {
                id: number;
                permissions: number[];
            }
        >({
            query: ({ id, permissions }) => ({

                url: `/users/${id}/permissions`,

                method: "POST",

                body: {
                    permissions
                }

            }),

            invalidatesTags: ["Users"]

        }),

        updateUserStatus: builder.mutation<
            User,
            {
                id: number;
                is_active: boolean;
            }
        >({
            query: ({ id, is_active }) => ({
                url: `/users/${id}/status`,
                method: "PATCH",
                body: { is_active },
            }),
            invalidatesTags: ["Users"],
        }),



        deleteUser: builder.mutation<
            void,
            number
        >({
            query: (id) => ({

                url: `/users/${id}`,

                method: "DELETE"

            }),

            invalidatesTags: ["Users"]

        }),





    }),
});


export const {
    useGetUsersQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useUpdateUserRolesMutation,
    useUpdateUserPermissionsMutation,
    useUpdateUserStatusMutation,
    useDeleteUserMutation

} = usersApi;