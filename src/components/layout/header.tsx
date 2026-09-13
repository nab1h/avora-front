'use client'

// Next Imports
import { Fragment } from 'react'

import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'

// Third-party Imports
import { LanguagesIcon } from 'lucide-react'

// Component Imports



import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import LanguageDropdown from '../shared/LanguageDropdown'
import { ModeToggle } from '../mode-toggle'
import ProfileDropdown from '../shared/ProfileDropdown'
import { LanguageSwitcher } from '../language-switcher'

const Header = () => {
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('breadcrumb')

  const segments = pathname.split('/').filter(Boolean).filter(segment => segment !== locale)

  return (
    <header className='bg-card sticky top-0 z-50 border-b'>
      <div className='flex w-full items-center justify-between gap-6 px-4 py-2 sm:px-6'>
        <div className='flex items-center gap-4'>
          <SidebarTrigger className='[&_svg]:size-5!' />
          <Separator orientation='vertical' className='hidden h-4! data-vertical:self-center sm:block' />
          <Breadcrumb className='hidden sm:block'>
            <BreadcrumbList>
              {segments.map((segment, index) => {
                const isLast = index === segments.length - 1
                const fallbackLabel = segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
                const label = t.has(segment) ? t(segment) : fallbackLabel
                const href = '/' + segments.slice(0, index + 1).join('/')

                return (
                  <Fragment key={href}>
                    <BreadcrumbItem>
                      {isLast ? <BreadcrumbPage>{label}</BreadcrumbPage> : <BreadcrumbLink>{label}</BreadcrumbLink>}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </Fragment>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className='flex items-center gap-1.5'>
          <ModeToggle />
          <LanguageSwitcher />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  )
}

export default Header