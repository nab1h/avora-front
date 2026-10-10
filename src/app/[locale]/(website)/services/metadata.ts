import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { getSeo, seoToMetadata } from '@/lib/seo';

export async function getServicesMetadata(locale: string): Promise<Metadata> {
  const [seo, t] = await Promise.all([
    getSeo('services', locale),
    getTranslations({ locale, namespace: 'publicServices' }),
  ]);

  return {
    ...seoToMetadata(seo),
    title: seo?.title ?? t('metaTitle'),
    description: seo?.description ?? t('metaDescription'),
  };
}