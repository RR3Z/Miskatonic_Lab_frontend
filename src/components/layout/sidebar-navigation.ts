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
  | (NavigationItemBase & {
      badge: string
      kind: "disabled"
    })

export const navigationItems: readonly NavigationItem[] = [
  {
    href: appRoutes.home,
    icon: House,
    kind: "link",
    label: "Главная",
  },
  {
    badge: "WIP",
    icon: BookOpenText,
    kind: "disabled",
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
  if (item.kind === "disabled" || !pathname) {
    return false
  }

  return item.href === appRoutes.home
    ? pathname === appRoutes.home
    : pathname.startsWith(item.href)
}
