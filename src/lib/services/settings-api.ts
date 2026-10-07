import { api } from './api';
import type { RootState } from '../store';

export type SettingField = {
  key: string;
  value: string | null;
  type: 'string' | 'text' | 'image' | 'url' | 'number' | 'boolean';
  group: string;
};

export type UpdateWebsiteSettingPayload = {
  key?: string;
  value?: string | null;
  file?: File | null;
  type?: string;
  values?: Record<string, string | null>;
};

export type SettingsResponse = {
  data: {
    general?: SettingField[];
    branding?: SettingField[];
    contact?: SettingField[];
    maps?: SettingField[];
  };
};

export const settingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getWebsiteSettings: builder.query<SettingsResponse, void>({
      query: () => ({
        url: '/admin/settings',
        method: 'GET',
      }),
      providesTags: ['Settings'],
    }),

    updateWebsiteSetting: builder.mutation<
      { success: boolean; message?: string },
      UpdateWebsiteSettingPayload
    >({
      queryFn: async ({ key, value, file, values }, { getState }, _extraOptions, baseQuery) => {
        const currentSettings = getCachedSettings(getState);
        const currentValues = Object.fromEntries(
          Object.values(currentSettings?.data ?? {})
            .flatMap((fields) => fields ?? [])
            .filter((field) => field.type !== 'image')
            .map((field) => [field.key, field.value ?? '']),
        );
        const valuesToSend = {
          ...currentValues,
          ...(key && !file ? { [key]: value ?? '' } : {}),
          ...values,
        };

        let request;
        if (file && key) {
          const formData = new FormData();
          formData.append(key, file);
          Object.entries(valuesToSend).forEach(([field, fieldValue]) => {
            formData.append(field, fieldValue ?? '');
          });

          request = {
            url: '/admin/settings',
            method: 'POST',
            body: formData,
          };
        } else {
          request = {
            url: '/admin/settings',
            method: 'POST',
            body: valuesToSend,
          };
        }

        const result = await baseQuery(request);
        if (result.error) return { error: result.error };

        return {
          data: result.data as { success: boolean; message?: string },
        };
      },
      invalidatesTags: ['Settings'],
    }),
  }),
});

function getCachedSettings(getState: () => unknown) {
  return settingsApi.endpoints.getWebsiteSettings.select()(getState() as RootState).data;
}

export const {
  useGetWebsiteSettingsQuery,
  useUpdateWebsiteSettingMutation,
} = settingsApi;
