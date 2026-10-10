'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  useGetWebsiteSettingsQuery,
  useUpdateWebsiteSettingMutation,
} from '@/lib/services/settings-api';
import { toast } from 'sonner';

export default function GeneralSettingsPage() {
  const t = useTranslations('websiteSettings.general');
  const { data, isLoading, isError } = useGetWebsiteSettingsQuery();
  const [updateWebsiteSetting, { isLoading: isSaving }] = useUpdateWebsiteSettingMutation();

  const settings = [
    ...(data?.data?.general ?? []),
    ...(data?.data?.branding ?? []),
    ...(data?.data?.contact ?? []),
    ...(data?.data?.maps ?? []),
  ];
  const siteNameField = settings.find((item) => item.key === 'site_name');
  const siteDescriptionField = settings.find((item) => item.key === 'site_description');

  const [siteName, setSiteName] = useState('');
  const [siteDescription, setSiteDescription] = useState('');

  useEffect(() => {
    if (siteNameField) setSiteName(siteNameField.value ?? '');
    if (siteDescriptionField) setSiteDescription(siteDescriptionField.value ?? '');
  }, [siteNameField, siteDescriptionField]);

  const handleSave = async () => {
    try {
      await updateWebsiteSetting({
        values: {
          site_name: siteName,
          site_description: siteDescription,
        },
      }).unwrap();
      toast.success(t('saveSuccess'));
    } catch {
      toast.error(t('saveFailed'));
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

      <Card>
        <CardHeader>
          <CardTitle>{t('websiteDetails')}</CardTitle>
          <CardDescription>{t('apiDescription')}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">{t('loading')}</p>
          ) : isError ? (
            <p className="text-sm text-red-500">{t('loadFailed')}</p>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('websiteName')}</label>
                <Input
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="AVORA"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('websiteDescription')}</label>
                <textarea
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                  className="min-h-28 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none"
                  placeholder={t('descriptionPlaceholder')}
                />
              </div>

              <Button type="button" onClick={handleSave} disabled={isSaving}>
                {isSaving ? t('saving') : t('saveChanges')}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
