"use client"

import { usePathname } from "next/navigation"

import { GuideLayoutToolbar } from "@/components/guide/search/guide-layout-toolbar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { isGuideRoute } from "@/components/layout/utils/is-guide-route.util"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

type SiteShellProps = {
  children: React.ReactNode
}

export function SiteShell({ children }: SiteShellProps) {
  const pathname = usePathname()
  const isGuide = isGuideRoute(pathname)

  return (
    <SidebarProvider
      defaultOpen={isGuide}
      key={isGuide ? "guide-shell" : "app-shell"}
      overlay={!isGuide}
    >
      <AppSidebar />
      <SidebarInset className="min-h-svh overflow-x-hidden">
        {isGuide ? (
          <GuideLayoutToolbar />
        ) : (
          <SidebarTrigger
            aria-label="Переключить боковую панель"
            className="fixed top-2 left-0 z-40 rounded-l-none border border-l-0 border-sidebar-border bg-sidebar shadow-none transition-[left] duration-200 hover:bg-sidebar-accent md:left-[var(--sidebar-width-icon)] md:group-data-[state=expanded]/sidebar-wrapper:left-[var(--sidebar-width)]"
            size="icon-lg"
          />
        )}
        <div
          className="flex min-h-0 flex-1 flex-col"
          data-slot="site-shell-content"
        >
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
