import { api } from "./api";
import type { SocialPlatform } from "./social-platforms";

export interface SocialLink {
    id: number;
    platform: SocialPlatform;
    url: string;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

interface SocialLinksResponse {
    data: SocialLink[];
}

export interface SocialLinkPayload {
    social_platform_id: number;
    url: string;
    is_active: boolean;
    sort_order: number;
}

export const socialLinksApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getSocialLinks: builder.query<
            SocialLink[],
            void
        >({
            query: () => "/social-links",
            transformResponse: (
                response: SocialLinksResponse
            ) => response.data,
            providesTags: ["SocialLinks"],
        }),

        createSocialLink: builder.mutation<
            SocialLink,
            SocialLinkPayload
        >({
            query: (body) => ({
                url: "/social-links",
                method: "POST",
                body,
            }),
            invalidatesTags: ["SocialLinks"],
        }),

        updateSocialLink: builder.mutation<
            SocialLink,
            {
                id: number;
                data: SocialLinkPayload;
            }
        >({
            query: ({ id, data }) => ({
                url: `/social-links/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["SocialLinks"],
        }),

        deleteSocialLink: builder.mutation<
            void,
            number
        >({
            query: (id) => ({
                url: `/social-links/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["SocialLinks"],
        }),
    }),
});

export const {
    useGetSocialLinksQuery,
    useCreateSocialLinkMutation,
    useUpdateSocialLinkMutation,
    useDeleteSocialLinkMutation,
} = socialLinksApi;