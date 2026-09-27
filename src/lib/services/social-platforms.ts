import { api } from "./api";

export interface SocialPlatform {
    id: number;
    name: string;
    slug: string;
    icon: string;
}

interface SocialPlatformsResponse {
    data: SocialPlatform[];
}

export const socialPlatformsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getSocialPlatforms: builder.query<
            SocialPlatform[],
            void
        >({
            query: () => "/social-platforms",
            transformResponse: (
                response: SocialPlatformsResponse
            ) => response.data,
        }),
    }),
});

export const {
    useGetSocialPlatformsQuery,
} = socialPlatformsApi;