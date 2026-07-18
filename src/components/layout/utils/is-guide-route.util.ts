import { appRoutes } from "@/lib/routes/app-routes"

export function isGuideRoute(pathname: string | null): boolean {
  return (
    pathname === appRoutes.guide ||
    pathname?.startsWith(`${appRoutes.guide}/`) === true
  )
}
