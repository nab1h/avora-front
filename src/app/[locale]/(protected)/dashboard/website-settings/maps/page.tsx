'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ExternalLink, MapPin, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  useGetWebsiteSettingsQuery,
  useUpdateWebsiteSettingMutation,
} from '@/lib/services/settings-api';

const mapFields = [
  {
    key: 'google_maps_url',
    label: 'mapsUrl',
    description: 'mapsUrlDescription',
    icon: MapPin,
  },
  {
    key: 'google_maps_embed_url',
    label: 'embedUrl',
    description: 'embedUrlDescription',
    icon: ExternalLink,
  },
] as const;

export default function MapsSettingsPage() {
  const t = useTranslations('websiteSettings.maps');
  const { data, isLoading, isError } = useGetWebsiteSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] = useUpdateWebsiteSettingMutation();

  const maps = data?.data?.maps ?? [];
  const settings = [
    ...(data?.data?.general ?? []),
    ...(data?.data?.branding ?? []),
    ...(data?.data?.contact ?? []),
    ...maps,
  ];
  const siteName = settings.find((item) => item.key === 'site_name')?.value?.trim() ?? '';
  const mapsUrl = maps.find((item) => item.key === 'google_maps_url')?.value ?? '';
  const embedUrl = maps.find((item) => item.key === 'google_maps_embed_url')?.value ?? '';

  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    setValues({
      google_maps_url: mapsUrl,
      google_maps_embed_url: embedUrl,
    });
  }, [mapsUrl, embedUrl]);

  const handleSave = async () => {
    if (!siteName) {
      toast.error(t('siteNameRequired'));
      return;
    }

    try {
      await updateSettings({
        values: {
          site_name: siteName,
          google_maps_url: values.google_maps_url ?? '',
          google_maps_embed_url: values.google_maps_embed_url ?? '',
        },
      }).unwrap();

      toast.success(t('saveSuccess'));
    } catch (error) {
      const errorData =
        typeof error === 'object' && error !== null && 'data' in error
          ? error.data
          : null;
      const validationMessages =
        typeof errorData === 'object' && errorData !== null && 'errors' in errorData
          ? Object.values(errorData.errors as Record<string, string[]>).flat()
          : [];
      const message =
        validationMessages.join(' ') ||
        (typeof errorData === 'object' && errorData !== null && 'message' in errorData &&
        typeof errorData.message === 'string'
          ? errorData.message
          : t('saveFailed'));

      toast.error(message);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 p-4 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-medium">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">{t('loading')}</p>
      ) : isError ? (
        <p className="text-sm text-red-500">{t('loadFailed')}</p>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {mapFields.map(({ key, label, description, icon: Icon }) => (
              <Card key={key}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                      <Icon className="size-4 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle>{t(`fields.${label}`)}</CardTitle>
                      <CardDescription>{t(`fields.${description}`)}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Input
                    type="url"
                    value={values[key] ?? ''}
                    onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))}
                    placeholder="https://maps.google.com/..."
                  />
                </CardContent>
              </Card>
            ))}
          </div>
          <Button type="button" onClick={handleSave} disabled={isSaving}>
            <Save data-icon="inline-start" />
            {isSaving ? t('saving') : t('save')}
          </Button>
        </div>
      )}
    </div>
  );
}
