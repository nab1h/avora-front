import { api } from "./api";
import type { User } from "@/lib/features/auth/auth-slice";

type UpdateProfileRequest = {
  name: string;
  email: string;
  phone: string;
  birthday: string;
  national_id: string;
  job: string;
  avatar?: File;
};

type UpdateProfileResponse = {
  message: string;
  user?: User;
  data?: User;
};

type ChangePasswordRequest = {
  current_password?: string;
  password: string;
  password_confirmation: string;
};

type ChangePasswordResponse = {
  message: string;
};

type VerificationNotificationResponse = {
  message: string;
  url: string;
};

export const profileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation<
      UpdateProfileResponse,
      UpdateProfileRequest
    >({
      query: (data) => {
        const formData = new FormData();

        // Laravel/PHP does not reliably parse multipart fields on PUT requests.
        formData.append("_method", "PUT");
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("phone", data.phone);
        formData.append("birthday", data.birthday);
        formData.append("national_id", data.national_id);
        formData.append("job", data.job);

        if (data.avatar) {
          formData.append("avatar", data.avatar);
        }

        return {
          url: "/profile",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["User"],
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
      invalidatesTags: ["User"],
    }),

    sendVerificationNotification: builder.mutation<
      VerificationNotificationResponse,
      void
    >({
      query: () => ({
        url: "/email/verification-notification",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useSendVerificationNotificationMutation,
} = profileApi;