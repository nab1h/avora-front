import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'

function SeoSectionSkeleton({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className='min-w-0 overflow-hidden rounded-lg border bg-card'>
      <div className='border-b bg-muted/30 px-4 py-3.5'>
        <h2 className='text-sm font-semibold'>{title}</h2>
      </div>
      <div className='grid gap-4 p-4 md:grid-cols-2'>{children}</div>
    </section>
  )
}

function FieldSkeleton({ className }: { className?: string }) {
  return (
    <div className={`min-w-0 space-y-1.5 ${className ?? ''}`}>
      <Skeleton className='h-3 w-16' />
      <Skeleton className='h-9 w-full rounded-md' />
    </div>
  )
}

function TextareaFieldSkeleton({ className }: { className?: string }) {
  return (
    <div className={`min-w-0 space-y-1.5 ${className ?? ''}`}>
      <Skeleton className='h-3 w-20' />
      <Skeleton className='h-20 w-full rounded-md' />
    </div>
  )
}

export function SeoPageSkeleton({ page }: { page?: string }) {
  const t = useTranslations('seo')
  const pageNameKey = page?.trim().toLowerCase().replace(/[\s-]+/g, '_')
  const displayPage = page && pageNameKey && t.has(`pageNames.${pageNameKey}`)
    ? t(`pageNames.${pageNameKey}`)
    : page?.replace(/[-_]/g, ' ')

  return (
    <div role='status' aria-busy='true' className='w-full min-w-0 max-w-full space-y-6 overflow-x-clip p-3 md:p-6'>
      <span className='sr-only'>{t('loading')}</span>

      <header className='flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:flex-wrap sm:items-end'>
        <div className='min-w-0 flex-1'>
          <p className='text-xs font-semibold uppercase text-muted-foreground'>{t('searchAppearance')}</p>
          {displayPage ? (
            <h1 className='mt-1 text-2xl font-semibold'>{t('title', { page: displayPage })}</h1>
          ) : (
            <Skeleton className='mt-1 h-8 w-72' />
          )}
        </div>
        {/* زي الصفحة: w-full على الموبايل ثم طبيعي على sm */}
        <div className='flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto'>
          <Skeleton className='h-9 w-24 rounded-md' />
          <Skeleton className='h-9 w-36 rounded-md' />
        </div>
      </header>

      <div className='space-y-6'>
        <SeoSectionSkeleton title={t('searchMetadata')}>
          <label className='space-y-1.5 text-xs font-medium text-muted-foreground'>
            {t('page')}
            <Input value={displayPage} readOnly disabled className='capitalize text-sm text-foreground' />
          </label>
          <FieldSkeleton />
          <TextareaFieldSkeleton className='md:col-span-2' />
          <FieldSkeleton className='md:col-span-2' />
        </SeoSectionSkeleton>

        <SeoSectionSkeleton title={t('socialSharing')}>
          <FieldSkeleton className='md:col-span-2' />
          <TextareaFieldSkeleton className='md:col-span-2' />
          <div className='min-w-0 space-y-2 md:col-span-2'>
            <Skeleton className='h-3 w-16' />
            <Skeleton className='aspect-[1200/630] w-full max-w-xl rounded-md' />
            <Skeleton className='h-10 w-full rounded-md border border-dashed' />
          </div>
        </SeoSectionSkeleton>

        <SeoSectionSkeleton title={t('indexingCanonical')}>
          <FieldSkeleton />
          <FieldSkeleton />
        </SeoSectionSkeleton>
      </div>
    </div>
  )
}