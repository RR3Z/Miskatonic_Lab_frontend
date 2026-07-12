import Link from "next/link"

import { AuthGateAction } from "@/components/auth/auth-gate-action"
import {
  isNavigationItemActive,
  isNavigationItemVisible,
  navigationItems,
} from "@/components/layout/site-header.navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils/cn.util"

type SiteNavigationProps = {
  onNavigate?: () => void
  pathname: string | null
  variant: "desktop" | "mobile"
}

export function SiteNavigation({
  onNavigate,
  pathname,
  variant,
}: SiteNavigationProps) {
  const isMobile = variant === "mobile"

  return (
    <nav
      aria-label={isMobile ? "Мобильная навигация" : "Основная навигация"}
      className={cn(
        isMobile
          ? "flex flex-col gap-2"
          : "hidden items-center gap-6 sm:flex sm:justify-self-center",
      )}
    >
      {navigationItems.map((item) => {
        if (!isNavigationItemVisible(item, variant)) {
          return null
        }

        const Icon = item.icon
        const isActive = isNavigationItemActive(item, pathname)
        const className = cn(
          "font-body text-base",
          isMobile && "w-full justify-start px-3 py-5",
          isActive &&
            "text-[var(--ml-accent-brass-strong)] hover:text-[var(--ml-accent-brass-strong)]",
        )

        switch (item.kind) {
          case "disabled":
            return (
              <Button
                aria-disabled="true"
                className={className}
                disabled
                key={item.label}
                variant="ghost"
              >
                <Icon aria-hidden="true" />
                {item.label}
                <span className="rounded border border-[var(--ml-border-aged)] px-1 py-0.5 font-code text-[0.56rem] leading-none text-[var(--ml-ink-muted)]">
                  {item.badge}
                </span>
              </Button>
            )
          case "auth":
            return (
              <AuthGateAction
                ariaCurrent={isActive ? "page" : undefined}
                className={className}
                href={item.href}
                key={item.label}
                onNavigate={onNavigate}
                variant="ghost"
              >
                <Icon aria-hidden="true" />
                {item.label}
              </AuthGateAction>
            )
          case "link":
            return (
              <Button
                asChild
                className={className}
                key={item.label}
                variant="ghost"
              >
                <Link
                  aria-current={isActive ? "page" : undefined}
                  href={item.href}
                  onClick={onNavigate}
                >
                  <Icon aria-hidden="true" />
                  {item.label}
                </Link>
              </Button>
            )
        }

        return null
      })}
    </nav>
  )
}
