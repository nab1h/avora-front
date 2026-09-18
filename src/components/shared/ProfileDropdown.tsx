'use client'

import { LogOutIcon, SettingsIcon, UserIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { getInitials } from '@/lib/utils'
import { logout } from '@/lib/features/auth/auth-slice'
import { api } from '@/lib/services/api'

const ProfileDropdown = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const t = useTranslations('profile')

  const user = useAppSelector((state) => state.auth.user)

  const fullName = user?.name ?? t('user')
  const email = user?.email ?? ''
  const initials = getInitials(fullName)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    dispatch(logout())
    dispatch(api.util.resetApiState())

    router.replace('/auth/login')
  }

  if (!user) {
    return null
  }

  return (
    <DropdownMenu>

      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage
            src=''
            alt={fullName}
          />

          <AvatarFallback>
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className='w-56'
        align='end'
      >

        {/* User Information */}
        <div className='px-2 py-2'>
          <div className='font-medium'>
            {fullName}
          </div>

          <div className='text-xs text-muted-foreground'>
            {email}
          </div>
        </div>

        <div className='my-1 h-px bg-border' />

        {/* Profile */}
        <DropdownMenuItem
          onClick={() => router.push('/dashboard/profile')}
        >
          <UserIcon />
          {t('title')}
        </DropdownMenuItem>

        {/* Settings */}
        <DropdownMenuItem
          onClick={() => router.push('/dashboard/settings')}
        >
          <SettingsIcon />
          {t('settings')}
        </DropdownMenuItem>

        <div className='my-1 h-px bg-border' />

        {/* Logout */}
        <DropdownMenuItem onClick={handleLogout}>
          <LogOutIcon />
          {t('signOut')}
        </DropdownMenuItem>

      </DropdownMenuContent>

    </DropdownMenu>
  )
}

export default ProfileDropdown