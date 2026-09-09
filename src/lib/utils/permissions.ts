import type { User } from '@/lib/features/auth/auth-slice'
import type {
  MenuGroupSubItem,
  MenuItem,
  MenuLeafSubItem,
  MenuSubItem,
  NavItem,
} from '@/config/navConfig'

export function hasPermission(
  user: User | null,
  permission?: string
): boolean {
  if (!permission) return true

  return (
    user?.permissions?.some(
      (item) => item.name === permission
    ) ?? false
  )
}

function filterSubItems(
  user: User | null,
  items: MenuSubItem[]
): MenuSubItem[] {
  return items
    .map((item) => {
      if ('childItems' in item) {
        const children = item.childItems.filter((child) =>
          hasPermission(user, child.permission)
        )

        if (children.length === 0) {
          return null
        }

        return {
          ...item,
          childItems: children,
        }
      }

      // Leaf item
      if (!hasPermission(user, item.permission)) {
        return null
      }

      return item
    })
    .filter(Boolean) as MenuSubItem[]
}

function filterMenuItems(
  user: User | null,
  items: MenuItem[]
): MenuItem[] {
  return items
    .map((item) => {
      if ('childItems' in item) {
        const children = filterSubItems(
          user,
          item.childItems ?? []
        )

        if (children.length === 0) {
          return null
        }

        return {
          ...item,
          childItems: children,
        }
      }

      if (!hasPermission(user, item.permission)) {
        return null
      }

      return item
    })
    .filter(Boolean) as MenuItem[]
}

export function filterNavItems(
  user: User | null,
  navItems: NavItem[]
): NavItem[] {
  return navItems
    .map((group) => {
      const items = filterMenuItems(
        user,
        group.items
      )

      if (items.length === 0) {
        return null
      }

      return {
        ...group,
        items,
      }
    })
    .filter(Boolean) as NavItem[]
}