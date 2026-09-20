'use client'

import { LogOutIcon, SettingsIcon, UserIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
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
import { getAvatarUrl } from '@/lib/avatar-url'
import { useState } from 'react'

const ProfileDropdown = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const user = useAppSelector((state) => state.auth.user)

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fullName = user?.name ?? 'user'
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

  const avatarSrc = avatarPreview ?? getAvatarUrl(user.avatar);

  return (
    <DropdownMenu>

      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage
            src={avatarSrc}
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
          Profile
        </DropdownMenuItem>

        {/* Settings */}
        <DropdownMenuItem
          onClick={() => router.push('/dashboard/settings')}
        >
          <SettingsIcon />
          Settings
        </DropdownMenuItem>

        <div className='my-1 h-px bg-border' />

        {/* Logout */}
        <DropdownMenuItem onClick={handleLogout}>
          <LogOutIcon />
          Logout
        </DropdownMenuItem>

      </DropdownMenuContent>

    </DropdownMenu>
  )
}

export default ProfileDropdown