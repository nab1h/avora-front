'use client'

// Next Imports
import Link from 'next/link'

// Third-party Imports
import { LogOutIcon, SettingsIcon, UserIcon } from 'lucide-react'

// Component Imports
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { getInitials } from '@/lib/utils'

import { logout } from '@/lib/features/auth/auth-slice'
import { useRouter } from 'next/navigation'

const ProfileDropdown = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const user = useAppSelector(state => state.auth.user)

  const fullName = user?.name ?? 'User'
  const email = user?.email ?? ''
  const initials = getInitials(fullName)
  const isActive = user?.is_active ?? false

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    dispatch(logout())
    router.replace('/auth/login')
  }


  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant='ghost' size='icon' className='relative rounded-full hover:bg-transparent' />}
      >
        <Avatar>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className={`ring-card absolute right-0 bottom-0 block size-2 rounded-full ring-2 ${isActive ? 'bg-green-600' : 'bg-red-600'}`} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-60'>
        <DropdownMenuGroup>
          <DropdownMenuLabel className='flex items-center gap-4 px-2 py-2.5 font-normal'>
            <div className='relative'>
              <Avatar className='size-10'>
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className={`ring-card absolute right-0 bottom-0 block size-2 rounded-full ring-2 ${isActive ? 'bg-green-600' : 'bg-red-600'}`} />
            </div>
            <div className='flex flex-1 flex-col items-start'>
              <span className='text-foreground text-base font-semibold'>{fullName}</span>
              <span className='text-muted-foreground text-sm'>{email}</span>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href='/dashboard/profile' />}>
            <UserIcon />
            <span>My Account</span>
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href='/pages/user-settings?setting=general' />}>
            <SettingsIcon />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem variant='destructive'  onClick={handleLogout}>
            <LogOutIcon />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileDropdown