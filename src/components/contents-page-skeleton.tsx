import { Skeleton } from '@/components/ui/skeleton'
import { useTranslations } from 'next-intl'
import { Plus } from 'lucide-react'

function ContentCardSkeleton({ variant = 'text' }: { variant?: 'text' | 'image' }) {
  return (
    <div className='overflow-hidden rounded-lg border bg-card'>
      {/* Card header: badge + section + title + edit button */}
      <div className='flex items-start justify-between gap-3 px-4 py-3.5'>
        <div className='min-w-0 flex-1 space-y-2'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-[18px] w-12 rounded-sm' />
            <Skeleton className='h-3 w-16' />
          </div>
          <Skeleton className='h-4 w-3/5' />
        </div>
        <Skeleton className='h-8 w-16 rounded-md' />
      </div>

      {/* Card body */}
      {variant === 'image' ? (
        <div className='mx-4 mb-4 overflow-hidden rounded-md border'>
          <Skeleton className='aspect-[16/7] w-full rounded-none' />
        </div>
      ) : (
        <div className='mx-4 mb-4'>
          <Skeleton className='h-16 w-full rounded-md' />
        </div>
      )}
    </div>
  )
}

function ContentSectionSkeleton({ cards = 2 }: { cards?: number }) {
  return (
    <section className='space-y-3'>
      {/* Section header */}
      <div className='flex items-center justify-between gap-3 border-b pb-2'>
        <div className='flex items-baseline gap-2'>
          <Skeleton className='h-4 w-28' />
          <Skeleton className='h-3 w-16' />
        </div>
        <Skeleton className='h-8 w-32 rounded-md' />
      </div>

      {/* Cards grid */}
      <div className='grid gap-4 md:grid-cols-2'>
        {Array.from({ length: cards }).map((_, index) => (
          <ContentCardSkeleton key={index} variant={index % 3 === 2 ? 'image' : 'text'} />
        ))}
      </div>
    </section>
  )
}

function AddContentFormSkeleton() {
  return (
    <section className='overflow-hidden rounded-lg border bg-card'>
      <div className='flex items-center gap-3 border-b bg-muted/30 px-4 py-3.5'>
        <div className='flex size-8 items-center justify-center rounded-md border bg-background text-muted-foreground shadow-sm'>
          <Plus className='size-4' />
        </div>
        <div className='space-y-1.5'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-3 w-40' />
        </div>
      </div>

      <div className='grid gap-x-4 gap-y-3 p-4 sm:grid-cols-2 xl:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className='space-y-1.5'>
            <Skeleton className='h-3 w-14' />
            <Skeleton className='h-10 w-full rounded-md' />
          </div>
        ))}
        <div className='flex justify-end sm:col-span-2 xl:col-span-4'>
          <Skeleton className='h-9 w-28 rounded-md' />
        </div>
      </div>
    </section>
  )
}

export function ContentsPageSkeleton({ page }: { page?: string }) {
  const t = useTranslations('contents')
  const pageNameKey = page?.trim().toLowerCase().replace(/[\s-]+/g, '_')
  const displayPage = page && pageNameKey && t.has(`pageNames.${pageNameKey}`)
    ? t(`pageNames.${pageNameKey}`)
    : page?.replace(/[-_]/g, ' ')

  return (
    <div role='status' aria-busy='true' className='space-y-6 p-3 md:p-6'>
      <span className='sr-only'>{t('loading')}</span>

      {/* Header */}
      <header className='flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-end'>
        {/* العنوان بيجي من props فمش محتاج سكيلتون */}
        {displayPage ? (
          <h1 className='mt-1 text-2xl font-semibold'>{displayPage}</h1>
        ) : (
          <Skeleton className='h-8 w-44' />
        )}

        <div className='flex items-center gap-5 text-sm'>
          <div className='flex items-center gap-1.5'>
            <Skeleton className='h-4 w-7' />
            <Skeleton className='h-3.5 w-10' />
          </div>
          <div className='h-6 w-px bg-border' />
          <div className='flex items-center gap-1.5'>
            <Skeleton className='h-4 w-7' />
            <Skeleton className='h-3.5 w-14' />
          </div>
        </div>
      </header>

      <AddContentFormSkeleton />

      {/* Page content */}
      <section className='space-y-3'>
        <div className='flex items-center justify-between'>
          <div className='space-y-2'>
            <Skeleton className='h-5 w-28' />
            <Skeleton className='h-4 w-72' />
          </div>
          <Skeleton className='h-3.5 w-16' />
        </div>

        <div className='space-y-6'>
          {[2, 4, 2].map((count, index) => (
            <ContentSectionSkeleton key={index} cards={count} />
          ))}
        </div>
      </section>
    </div>
  )
}