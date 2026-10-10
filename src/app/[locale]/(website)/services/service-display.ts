import type { Service } from '@/lib/services/services-api';

export function getServiceDisplay(service: Service, locale: string) {
  if (locale === 'ar') {
    return {
      name: service.name_ar?.trim() || service.name,
      description: service.description_ar?.trim() || service.description,
      slug: service.slug_ar?.trim() || service.slug,
    };
  }

  return {
    name: service.name,
    description: service.description,
    slug: service.slug,
  };
}