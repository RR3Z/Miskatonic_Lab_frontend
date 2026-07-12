import type { LucideIcon } from "lucide-react"
import { BookOpenText, House, UsersRound } from "lucide-react"

import { appRoutes } from "@/lib/routes/app-routes"

type NavigationItemBase = {
  icon: LucideIcon
  label: string
  visibility: "all" | "mobile"
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
    visibility: "mobile",
  },
  {
    badge: "WIP",
    icon: BookOpenText,
    kind: "disabled",
    label: "Справочник",
    visibility: "all",
  },
  {
    href: appRoutes.characters,
    icon: UsersRound,
    kind: "auth",
    label: "Список персонажей",
    visibility: "all",
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

export function isNavigationItemVisible(
  item: NavigationItem,
  variant: "desktop" | "mobile",
) {
  return item.visibility === "all" || variant === "mobile"
}
