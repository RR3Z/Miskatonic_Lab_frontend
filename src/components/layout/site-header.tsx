"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

import { HeaderAuth } from "@/components/auth/header-auth"
import { BrandMark } from "@/components/brand/brand-mark"
import { MobileSiteMenu } from "@/components/layout/mobile-site-menu"
import { SiteNavigation } from "@/components/layout/site-navigation"
import { landingContent } from "@/lib/content/landing.content"
import { appRoutes } from "@/lib/routes/app-routes"

export function SiteHeader() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[var(--ml-border-aged)] bg-[var(--ml-bg-page)]/35 px-4 py-1.5 text-[var(--ml-ink-muted)] sm:grid sm:grid-cols-[1fr_auto_1fr] sm:px-8 sm:py-2.5">
      <Link
        aria-label="Miskatonic Lab home"
        className="inline-flex w-32 shrink-0 sm:w-36 sm:justify-self-start"
        href={appRoutes.home}
      >
        <BrandMark />
      </Link>
      <SiteNavigation pathname={pathname} variant="desktop" />
      <div className="hidden sm:block sm:justify-self-end">
        <HeaderAuth>{landingContent.header.signIn}</HeaderAuth>
      </div>
      <MobileSiteMenu
        onOpenChange={setMobileMenuOpen}
        open={mobileMenuOpen}
        pathname={pathname}
      />
    </header>
  )
}
