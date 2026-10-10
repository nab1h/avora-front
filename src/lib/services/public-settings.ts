import { cache } from 'react';
export { getPublicAssetUrl } from './public-assets';

export type PublicSettingsData = {
  general?: {
    site_name?: string;
    site_description?: string;
  };
  branding?: {
    site_logo?: string | null;
    site_favicon?: string | null;
    site_apple_icon?: string | null;
    site_android_icon?: string | null;
    site_maskable_icon?: string | null;
  };
  contact?: {
    contact_email?: string | null;
    contact_phone?: string | null;
    contact_whatsapp?: string | null;
    contact_address?: string | null;
    contact_address_ar?: string | null;
  };
  maps?: {
    google_maps_url?: string | null;
    google_maps_embed_url?: string | null;
  };
};

type PublicSettingsResponse = {
  data: PublicSettingsData;
};

export type PublicSocialLink = {
  id: number;
  platform: {
    id: number;
    name: string;
    slug: string;
    icon: string;
  };
  url: string;
  is_active: boolean;
  sort_order: number;
};

type PublicSocialLinksResponse = {
  data: PublicSocialLink[];
};

export const getPublicSettings = cache(async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '');
  if (!apiUrl) return null;

  try {
    const response = await fetch(`${apiUrl}/settings`, { cache: 'no-store' });
    if (!response.ok) return null;

    return (await response.json()) as PublicSettingsResponse;
  } catch {
    return null;
  }
});

export const getPublicSocialLinks = cache(async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '');
  if (!apiUrl) return [];

  try {
    const response = await fetch(`${apiUrl}/social-links`, { cache: 'no-store' });
    if (!response.ok) return [];

    const result = (await response.json()) as PublicSocialLinksResponse;
    return result.data
      .filter((link) => link.is_active)
      .sort((first, second) => first.sort_order - second.sort_order);
  } catch {
    return [];
  }
});

