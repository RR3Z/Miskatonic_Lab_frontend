"use client"

import { BookOpenText, UsersRound } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { AuthGateAction } from "@/components/auth/auth-gate-action"
import { HeaderAuth } from "@/components/auth/header-auth"
import { BrandMark } from "@/components/brand/brand-mark"
import { Button } from "@/components/ui/button"
import { landingContent } from "@/lib/content/landing.content"
import { appRoutes } from "@/lib/routes/app-routes"
import { cn } from "@/lib/utils/cn.util"

const navLinks = [
  { label: "Справочник", icon: BookOpenText, disabled: true },
  {
    label: "Список персонажей",
    href: appRoutes.characters,
    icon: UsersRound,
    auth: true,
  },
] as const

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[var(--ml-border-aged)] bg-[var(--ml-bg-page)]/35 px-4 py-1.5 text-[var(--ml-ink-muted)] sm:px-8 sm:py-2.5">
      <Link
        aria-label="Miskatonic Lab home"
        className="inline-flex w-32 shrink-0 sm:w-36"
        href={appRoutes.home}
      >
        <BrandMark />
      </Link>
      <nav className="flex items-center gap-6">
        {navLinks.map((link) => {
          const Icon = link.icon
          const isActive =
            "href" in link &&
            link.href === appRoutes.characters &&
            Boolean(pathname?.startsWith(appRoutes.characters))
          const className = cn(
            "font-body text-base",
            isActive &&
              "text-[var(--ml-accent-brass-strong)] hover:text-[var(--ml-accent-brass-strong)]",
          )

          if ("disabled" in link && link.disabled) {
            return (
              <Button
                aria-disabled="true"
                className="font-body text-base"
                disabled
                key={link.label}
                variant="ghost"
              >
                <Icon aria-hidden="true" />
                {link.label}
                <span className="rounded border border-[var(--ml-border-aged)] px-1 py-0.5 font-code text-[0.56rem] leading-none text-[var(--ml-ink-muted)]">
                  WIP
                </span>
              </Button>
            )
          }

          if ("auth" in link && link.auth) {
            return (
              <AuthGateAction
                ariaCurrent={isActive ? "page" : undefined}
                className={className}
                key={link.label}
                href={link.href}
                variant="ghost"
              >
                <Icon aria-hidden="true" />
                {link.label}
              </AuthGateAction>
            )
          }

          return null
        })}
      </nav>
      <HeaderAuth>{landingContent.header.signIn}</HeaderAuth>
    </header>
  )
}
