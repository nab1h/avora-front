'use client';

import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetServicesQuery } from '@/lib/services/services-api';

import ServiceCardImage from '../service-card-image';
import { getServiceDisplay } from '../service-display';

type ServiceDetailsProps = {
  slug: string;
};

export default function ServiceDetails({ slug }: ServiceDetailsProps) {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const t = useTranslations('publicServices');
  const { data, isLoading, isError, refetch } = useGetServicesQuery();

  const service = (data?.data ?? []).find(
    (item) => item.is_active && getServiceDisplay(item, locale).slug === slug,
  );
  const display = service ? getServiceDisplay(service, locale) : null;
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  return (
    <main
      dir={isArabic ? 'rtl' : 'ltr'}
      className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16"
    >
      <Link
        href="/services"
        className="inline-flex min-h-10 items-center gap-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <BackIcon aria-hidden="true" className="size-4" />
        {t('backToServices')}
      </Link>

      {isLoading && (
        <div className="mt-8 grid gap-8 md:grid-cols-2 md:items-center">
          <Skeleton aria-hidden="true" className="aspect-[4/3] w-full" />
          <div role="status" aria-label={t('loading')} className="space-y-4">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
          </div>
        </div>
      )}

      {!isLoading && isError && (
        <section role="alert" className="mt-8 rounded-lg border px-6 py-12 text-center">
          <p className="text-muted-foreground">{t('loadFailed')}</p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            <RefreshCw aria-hidden="true" className="size-4" />
            {t('tryAgain')}
          </Button>
        </section>
      )}

      {!isLoading && !isError && !service && (
        <section className="mt-8 rounded-lg border px-6 py-12 text-center">
          <h1 className="text-2xl font-semibold">{t('notFoundTitle')}</h1>
          <p className="mt-2 text-muted-foreground">{t('notFoundDescription')}</p>
        </section>
      )}

      {!isLoading && !isError && service && display && (
        <article className="mt-8 grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
          <ServiceCardImage
            image={service.image}
            alt={t('imageAlt', { name: display.name })}
            className="aspect-[4/3] rounded-lg"
          />
          <div>
            <p className="text-sm font-semibold text-primary">{t('detailLabel')}</p>
            <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
              {display.name}
            </h1>
            <p className="mt-5 whitespace-pre-line text-base leading-8 text-muted-foreground">
              {display.description || t('noDescription')}
            </p>
            <Button render={<Link href="/contact" />} className="mt-7">
              {t('contactAboutService')}
            </Button>
          </div>
        </article>
      )}
    </main>
  );
}