import { api } from "./api";

export interface Service {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface ServicesResponse {
    data: Service[];
}

export const servicesApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // -------------------
        // services
        // -------------------  
        getServices: builder.query<
            {
                data: Service[];
            },
            void
        >({
            query: () => ({
                url: "/admin/services",
                method: "GET",
            }),
            providesTags: ["Services"],
        }),

        // create services

        createService: builder.mutation<Service, FormData>({
            query: (formData) => ({
                url: "/services",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Services"],
        }),

        // edit services
        editService: builder.mutation<
            Service,
            {
                id: number;
                formData: FormData;
            }
        >({
            query: ({ id, formData }) => ({
                url: `/services/${id}`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Services"],
        }),

        // delete services
        deleteService: builder.mutation<void, number>({
            query: (id) => ({
                url: `/services/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Services"],
        }),



    }),
});


export const {
    useGetServicesQuery,
    useCreateServiceMutation,
    useEditServiceMutation,
    useDeleteServiceMutation,
} = servicesApi;