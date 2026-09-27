import { api } from "./api";


export interface Gallery {
    id: number;
    image: string;
    created_at: string;
    updated_at: string;
}

export const galleryApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // index
        getGallery: builder.query<Gallery[], void>({
            query: () => "/admin/gallery",

            providesTags: ["Gallery"],
        }),

        // create
        createGallery: builder.mutation<
            Gallery[],
            {
                formData: FormData;
            }
        >({
            query: ({ formData }) => ({
                url: "/gallery",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Gallery"],
        }),


        // delete
        deleteGallery: builder.mutation<
            void,
            number
        >({
            query: (id) => ({
                url: `/gallery/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Gallery"],
        }),

        // delete the selected
        bulkDeleteGallery: builder.mutation<
            void,
            {
                ids: number[];
            }
        >({
            query: ({ ids }) => ({
                url: "/gallery/bulk-delete",
                method: "DELETE",
                body: {
                    ids,
                },
            }),
            invalidatesTags: ["Gallery"],
        }),



    }),
});

export const {
    useGetGalleryQuery,
    useCreateGalleryMutation,
    useDeleteGalleryMutation,
    useBulkDeleteGalleryMutation,
} = galleryApi;