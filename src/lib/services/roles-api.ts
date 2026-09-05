import { api } from "./api";

interface Permission {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}

interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    permissions: Permission[];
}

export const rolesApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // -------------------
        // Roles
        // -------------------  
        getRoles: builder.query<
            {
                data: Role[];
            },
            void
        >({
            query: () => ({
                url: "/roles",
                method: "GET",
            }),
            providesTags: ["Roles"],
        }),

        // -------------------
        // Create Role
        // -------------------
        createRole: builder.mutation<
            {
                data: Role;
            },
            {
                name: string;
            }
        >({
            query: (newRole) => ({
                url: "/roles",
                method: "POST",
                body: newRole,
            }),

            invalidatesTags: ["Roles"],
        }),


        // -------------------
        // Delete Role
        // -------------------  
        deleteRole: builder.mutation<
            {
                message: string;
            },
            number
        >({
            query: (id) => ({
                url: `/roles/${id}`,
                method: "DELETE",
            }),

            invalidatesTags: ["Roles"],
        }),

        // -------------------
        // Update Role
        // -------------------  
        updateRole: builder.mutation<
            Role,
            {
                id: number;
                name: string;
            }
        >({
            query: ({ id, name }) => ({
                url: `/roles/${id}`,
                method: "PUT",
                body: {
                    name
                },
            }),

            invalidatesTags: ["Roles"],
        }),

        // -------------------
        // Sync Role Permissions
        // -------------------
        syncRolePermissions: builder.mutation<
            Role,
            {
                id: number;
                permissions: number[];
            }
        >({
            query: ({ id, permissions }) => ({

                url: `/roles/${id}/permissions`,
                method: "POST",

                body: {
                    permissions
                }

            }),

            invalidatesTags: ["Roles"],

        }),
        // -------------------
        // Permissions
        // -------------------

        getPermissions: builder.query<
            {
                data: Permission[];
            },
            void
        >({
            query: () => ({
                url: "/permissions",
                method: "GET",
            }),
        }),


    }),
});


export const {
    useGetRolesQuery,
    useGetPermissionsQuery,
    useCreateRoleMutation,
    useDeleteRoleMutation,
    useUpdateRoleMutation,
    useSyncRolePermissionsMutation,

} = rolesApi;