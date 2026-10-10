'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  type SiteSettingKey,
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
  const siteNameArField = settings.find((item) => item.key === 'site_name_ar');
  const siteDescriptionArField = settings.find((item) => item.key === 'site_description_ar');

  const [siteName, setSiteName] = useState<string>();
  const [siteDescription, setSiteDescription] = useState<string>();
  const [siteNameAr, setSiteNameAr] = useState<string>();
  const [siteDescriptionAr, setSiteDescriptionAr] = useState<string>();
  const siteNameValue = siteName ?? siteNameField?.value ?? '';
  const siteDescriptionValue = siteDescription ?? siteDescriptionField?.value ?? '';
  const siteNameArValue = siteNameAr ?? siteNameArField?.value ?? '';
  const siteDescriptionArValue = siteDescriptionAr ?? siteDescriptionArField?.value ?? '';

  const handleSave = async () => {
    try {
      const values = {
        site_name: siteNameValue,
        site_description: siteDescriptionValue,
        site_name_ar: siteNameArValue,
        site_description_ar: siteDescriptionArValue,
      } satisfies Record<SiteSettingKey, string | null>;
      await updateWebsiteSetting({
        values,
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
                <Label htmlFor="site-name">{t('websiteName')}</Label>
                <Input
                  id="site-name"
                  dir="ltr"
                  value={siteNameValue}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="AVORA"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="site-description">{t('websiteDescription')}</Label>
                <Textarea
                  id="site-description"
                  dir="ltr"
                  value={siteDescriptionValue}
                  onChange={(e) => setSiteDescription(e.target.value)}
                  className="min-h-28"
                  placeholder={t('descriptionPlaceholder')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="site-name-ar">{t('websiteNameAr')}</Label>
                <Input
                  id="site-name-ar"
                  dir="rtl"
                  value={siteNameArValue}
                  onChange={(e) => setSiteNameAr(e.target.value)}
                  placeholder="أفورا"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="site-description-ar">{t('websiteDescriptionAr')}</Label>
                <Textarea
                  id="site-description-ar"
                  dir="rtl"
                  value={siteDescriptionArValue}
                  onChange={(e) => setSiteDescriptionAr(e.target.value)}
                  className="min-h-28"
                  placeholder={t('descriptionPlaceholderAr')}
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
