'use client';

import { ArrowLeft, ArrowRight, ArrowUpLeft, ArrowUpRight, PackageOpen, RefreshCw } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { useGetServicesQuery } from '@/lib/services/services-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import ServiceCardImage from './service-card-image';
import { getServiceDisplay } from './service-display';

export default function ServicesList() {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const t = useTranslations('publicServices');
  const { data, isLoading, isError, refetch } = useGetServicesQuery();

  const services = (data?.data ?? [])
    .filter((service) => service.is_active)
    .sort((first, second) => first.sort_order - second.sort_order);

  return (
    <main
      dir={isArabic ? 'rtl' : 'ltr'}
      className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20"
    >
      <header className="max-w-2xl">
        <p className="text-sm font-semibold text-primary">{t('eyebrow')}</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
          {t('title')}
        </h1>
        <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
          {t('intro')}
        </p>
      </header>

      {isLoading && (
        <div
          role="status"
          aria-label={t('loading')}
          aria-busy="true"
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {Array.from({ length: 6 }, (_, index) => (
            <Card key={index} aria-hidden="true" className="overflow-hidden">
              <Skeleton className="aspect-[16/10] w-full rounded-none" />
              <CardContent className="space-y-4 p-5">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-9 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <section
          role="alert"
          className="mt-10 flex flex-col items-center gap-4 rounded-lg border px-6 py-14 text-center"
        >
          <p className="text-muted-foreground">{t('loadFailed')}</p>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw aria-hidden="true" className="size-4" />
            {t('tryAgain')}
          </Button>
        </section>
      )}

      {!isLoading && !isError && services.length === 0 && (
        <section className="mt-10 flex flex-col items-center gap-3 rounded-lg border px-6 py-14 text-center">
          <PackageOpen aria-hidden="true" className="size-9 text-muted-foreground" />
          <h2 className="text-lg font-semibold">{t('emptyTitle')}</h2>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            {t('emptyDescription')}
          </p>
        </section>
      )}

      {!isLoading && !isError && services.length > 0 && (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const display = getServiceDisplay(service, locale);
            const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;
            const CornerIcon = isArabic ? ArrowUpLeft : ArrowUpRight;

            return (
              <Card
                key={service.id}
                className="group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md"
              >
                <ServiceCardImage
                  image={service.image}
                  alt={t('imageAlt', { name: display.name })}
                  className="aspect-[16/10]"
                />
                <CardContent className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-xl font-semibold leading-snug">
                      {display.name}
                    </h2>
                    <CornerIcon
                      aria-hidden="true"
                      className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5"
                    />
                  </div>
                  <p className="mt-3 line-clamp-3 min-h-18 text-sm leading-6 text-muted-foreground">
                    {display.description || t('noDescription')}
                  </p>
                  <Link
                    href={`/services/${encodeURIComponent(display.slug)}`}
                    aria-label={t('viewDetailsFor', { name: display.name })}
                    className="mt-5 inline-flex min-h-10 w-fit items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {t('viewDetails')}
                    <ArrowIcon aria-hidden="true" className="size-4" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}