import type { NavigationItem } from "@/components/layout/types/navigation.types"
import { appRoutes } from "@/lib/routes/app-routes"

export function isNavigationItemActive(
  item: NavigationItem,
  pathname: string | null,
) {
  if (!pathname) return false

  return item.href === appRoutes.home
    ? pathname === appRoutes.home
    : pathname.startsWith(item.href)
}
