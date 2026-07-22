"use client"

import type * as React from "react"

import { Button } from "@/components/ui/button"
import localizedContent from "@/data/locales/ru/common/ui.ru.json"
import { useSidebar } from "@/hooks/ui/use-sidebar"
import { cn } from "@/lib/utils/cn.util"

export function SidebarRail({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label={
        localizedContent.copy.componentsUiSidebar.pereklyuchitBokovuyuPanel
      }
      tabIndex={-1}
      onClick={toggleSidebar}
      size="content"
      title={
        localizedContent.copy.componentsUiSidebar.pereklyuchitBokovuyuPanel
      }
      type="button"
      variant="unstyled"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] hover:after:bg-sidebar-border sm:flex ltr:-translate-x-1/2 rtl:-translate-x-1/2",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className,
      )}
      {...props}
    />
  )
}
