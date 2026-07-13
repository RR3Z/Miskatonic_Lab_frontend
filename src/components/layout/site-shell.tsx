"use client"

import { useEffect, useState } from "react"

import { AppSidebar } from "@/components/layout/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const SIDEBAR_COOKIE_NAME = "sidebar_state"

type SiteShellProps = {
  children: React.ReactNode
}

function readSidebarPreference() {
  const value = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${SIDEBAR_COOKIE_NAME}=`))
    ?.split("=")[1]

  return value === "true" ? true : value === "false" ? false : undefined
}

export function SiteShell({ children }: SiteShellProps) {
  const [open, setOpen] = useState(true)

  useEffect(() => {
    const savedPreference = readSidebarPreference()
    if (savedPreference !== undefined) {
      setOpen(savedPreference)
    }
  }, [])

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AppSidebar />
      <SidebarInset className="min-h-svh overflow-x-hidden">
        <SidebarTrigger
          aria-label="Переключить боковую панель"
          className="fixed top-3 left-3 z-40 border border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel)] shadow-lg transition-[left] min-[1200px]:left-[calc(var(--sidebar-width)+0.75rem)] group-data-[state=collapsed]/sidebar-wrapper:min-[1200px]:left-[calc(var(--sidebar-width-icon)+0.75rem)]"
          size="icon-lg"
        />
        <div className="flex min-h-0 flex-1 flex-col pt-14">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
