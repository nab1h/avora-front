import type { MetadataRoute } from 'next';
import { getPublicAssetUrl, getPublicSettings } from '@/lib/services/public-settings';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getPublicSettings();
  const general = settings?.data.general;
  const branding = settings?.data.branding;
  const androidIcon = getPublicAssetUrl(branding?.site_android_icon);
  const maskableIcon = getPublicAssetUrl(branding?.site_maskable_icon);

  return {
    name: general?.site_name || 'AVORA',
    short_name: general?.site_name || 'AVORA',
    description: general?.site_description || 'Digital Card Platform',
    start_url: '/',
    display: 'standalone',
    icons: [
      ...(androidIcon
        ? [{ src: androidIcon, sizes: '192x192', type: 'image/png' }]
        : []),
      ...(maskableIcon
        ? [{ src: maskableIcon, sizes: '512x512', type: 'image/png', purpose: 'maskable' as const }]
        : []),
    ],
  };
}