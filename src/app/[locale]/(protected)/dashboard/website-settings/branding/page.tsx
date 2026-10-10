'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ImagePlus, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  useGetWebsiteSettingsQuery,
  useUpdateWebsiteSettingMutation,
  type SettingField,
} from '@/lib/services/settings-api';

const brandingFields = [
  { key: 'site_logo', label: 'siteLogo', description: 'siteLogoDescription' },
  { key: 'site_favicon', label: 'favicon', description: 'faviconDescription' },
  { key: 'site_apple_icon', label: 'appleIcon', description: 'appleIconDescription' },
  { key: 'site_android_icon', label: 'androidIcon', description: 'androidIconDescription' },
  { key: 'site_maskable_icon', label: 'maskableIcon', description: 'maskableIconDescription' },
] as const;

const storageUrl = (
  process.env.NEXT_PUBLIC_STORAGE_URL ??
  `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') ?? 'http://localhost:8000'}/storage`
).replace(/\/+$/, '');

function getBrandingImageUrl(image: string) {
  const imageUrl = /^https?:\/\//i.test(image)
    ? image
    : `${storageUrl}/${image.replace(/^\/+/, '').replace(/^storage\/+/, '')}`;

  try {
    const url = new URL(imageUrl);
    if (!url.port && ['localhost', '127.0.0.1'].includes(url.hostname)) {
      url.host = new URL(storageUrl).host;
    }
    return url.toString();
  } catch {
    return imageUrl;
  }
}

export default function BrandingSettingsPage() {
  const t = useTranslations('websiteSettings.branding');
  const { data, isLoading, isError, refetch } = useGetWebsiteSettingsQuery();
  const [updateWebsiteSetting, { isLoading: isSaving }] = useUpdateWebsiteSettingMutation();

  const settings = [
    ...(data?.data?.general ?? []),
    ...(data?.data?.branding ?? []),
    ...(data?.data?.contact ?? []),
    ...(data?.data?.maps ?? []),
  ];
  const branding = data?.data?.branding ?? [];
  const siteName = settings.find((item) => item.key === 'site_name')?.value?.trim() ?? '';
  const [fileMap, setFileMap] = useState<Record<string, File | null>>({});

  const findField = (key: string): SettingField | undefined =>
    branding.find((item) => item.key === key);

  const handleFile = (key: string, file: File | null) => {
    setFileMap((prev) => ({ ...prev, [key]: file }));
  };

  const handleSave = async (key: string) => {
    const field = findField(key);
    const selectedFile = fileMap[key] ?? null;
    if (!field || !selectedFile) return;
    if (!siteName) {
      toast.error(t('siteNameRequired'));
      return;
    }

    try {
      await updateWebsiteSetting({
        key: field.key,
        file: selectedFile,
        type: field.type,
        values: { site_name: siteName },
      }).unwrap();

      toast.success(t('uploadSuccess'));
      setFileMap((prev) => ({ ...prev, [key]: null }));
      await refetch();
    } catch (error) {
      const message =
        typeof error === 'object' && error !== null && 'data' in error &&
        typeof error.data === 'object' && error.data !== null && 'message' in error.data &&
        typeof error.data.message === 'string'
          ? error.data.message
          : t('uploadFailed');
      toast.error(message);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 p-4 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-medium">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('description')}
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">{t('loading')}</p>
      ) : isError ? (
        <p className="text-sm text-red-500">{t('loadFailed')}</p>
      ) : (
        <div className="divide-y rounded-lg border">
          {brandingFields.map(({ key, label, description }) => {
            const field = findField(key);
            const currentValue = field?.value ?? '';
            const selectedFile = fileMap[key];
            const translatedLabel = t(`fields.${label}`);

            return (
              <div key={key} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted/30">
                    {currentValue ? (
                      <img src={getBrandingImageUrl(currentValue)} alt={translatedLabel} className="size-full object-contain p-1" />
                    ) : (
                      <ImagePlus className="size-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm font-medium">{translatedLabel}</h2>
                    <p className="text-sm text-muted-foreground">{t(`fields.${description}`)}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:w-72">
                  <input
                    id={`image-${key}`}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => handleFile(key, e.target.files?.[0] ?? null)}
                  />
                  <label
                    htmlFor={`image-${key}`}
                    className="flex min-h-10 cursor-pointer items-center gap-2 rounded-md border border-dashed px-3 text-sm hover:bg-muted/50"
                  >
                    <ImagePlus className="size-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">
                      {selectedFile?.name ?? t('chooseImage')}
                    </span>
                  </label>
                  <Button
                    type="button"
                    onClick={() => handleSave(key)}
                    disabled={isSaving || !selectedFile}
                  >
                    <Save data-icon="inline-start" />
                    {isSaving ? t('uploading') : t('saveImage')}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
