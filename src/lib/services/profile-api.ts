import { api } from "./api";

type UpdateProfileRequest = {
  name: string;
  email: string;
};

type UpdateProfileResponse = {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    roles: {
      id: number;
      name: string;
      guard_name: string;
    }[];
    permissions: {
      id: number;
      name: string;
      guard_name: string;
    }[];
  };
};

type ChangePasswordRequest = {
  current_password: string;
  password: string;
  password_confirmation: string;
};

type ChangePasswordResponse = {
  message: string;
};

export const profileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation<
      UpdateProfileResponse,
      UpdateProfileRequest
    >({
      query: (data) => ({
        url: "/profile",
        method: "PUT",
        body: data,
      }),
    }),

    changePassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordRequest
    >({
      query: (data) => ({
        url: "/change-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = profileApi;