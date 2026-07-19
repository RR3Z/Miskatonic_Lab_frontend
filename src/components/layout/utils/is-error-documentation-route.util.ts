import { appRoutes } from "@/lib/routes/app-routes"

export function isErrorDocumentationRoute(pathname: string | null): boolean {
  return (
    pathname === appRoutes.errors ||
    pathname?.startsWith(`${appRoutes.errors}/`) === true
  )
}
