import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { hasConfiguredClerkKeys } from "@/lib/clerk/server-config"
import { appRoutes } from "@/lib/routes/app-routes"

export default async function CharactersLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (!hasConfiguredClerkKeys()) {
    redirect(appRoutes.home)
  }

  const { userId } = await auth()

  if (!userId) {
    redirect(appRoutes.charactersSignIn)
  }

  return children
}
