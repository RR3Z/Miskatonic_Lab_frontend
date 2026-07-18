import type { LucideIcon } from "lucide-react"
import { BookOpenText, House, UsersRound } from "lucide-react"

import { appRoutes } from "@/lib/routes/app-routes"

type NavigationItemBase = {
  icon: LucideIcon
  label: string
}

export type NavigationItem =
  | (NavigationItemBase & {
      href: string
      kind: "link"
    })
  | (NavigationItemBase & {
      href: string
      kind: "auth"
    })

export const navigationItems: readonly NavigationItem[] = [
  {
    href: appRoutes.home,
    icon: House,
    kind: "link",
    label: "Главная",
  },
  {
    href: appRoutes.guide,
    icon: BookOpenText,
    kind: "link",
    label: "Справочник",
  },
  {
    href: appRoutes.characters,
    icon: UsersRound,
    kind: "auth",
    label: "Список персонажей",
  },
]

export function isNavigationItemActive(
  item: NavigationItem,
  pathname: string | null,
) {
  if (!pathname) {
    return false
  }

  return item.href === appRoutes.home
    ? pathname === appRoutes.home
    : pathname.startsWith(item.href)
}
