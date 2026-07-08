import Link from "next/link"

import { HeaderAuth } from "@/components/auth/header-auth"
import { BrandMark } from "@/components/brand/brand-mark"
import { landingContent } from "@/lib/content/landing.content"
import { appRoutes } from "@/lib/routes/app-routes"

export function LandingHeader() {
  return (
    <header className="relative z-10 flex items-start justify-between gap-4 px-5 pt-4 sm:px-8">
      <Link
        aria-label="Miskatonic Lab home"
        className="inline-flex w-32 cursor-pointer sm:w-44"
        href={appRoutes.home}
      >
        <BrandMark priority />
      </Link>
      <HeaderAuth>{landingContent.header.signIn}</HeaderAuth>
    </header>
  )
}
