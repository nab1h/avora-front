import type { MetadataRoute } from 'next';
import { getPublicAssetUrl, getPublicSettings } from '@/lib/services/public-settings';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getPublicSettings();
  const branding = settings?.data.branding;
  const icons: NonNullable<MetadataRoute.Manifest['icons']> = [];
  const androidIcon = getPublicAssetUrl(branding?.site_android_icon);
  const maskableIcon = getPublicAssetUrl(branding?.site_maskable_icon);

  if (androidIcon) {
    icons.push({ src: androidIcon, purpose: 'any' });
  }

  if (maskableIcon) {
    icons.push({ src: maskableIcon, purpose: 'maskable' });
  }

  return {
    name: settings?.data.general?.site_name || 'AVORA',
    short_name: settings?.data.general?.site_name || 'AVORA',
    description: settings?.data.general?.site_description || 'AVORA Application',
    start_url: '/',
    display: 'standalone',
    icons,
  };
}