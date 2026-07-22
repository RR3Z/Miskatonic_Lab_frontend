"use client"

import { PanelLeftIcon } from "lucide-react"

import type * as React from "react"

import { Button } from "@/components/ui/button"

import localizedContent from "@/data/locales/ru/common/ui.ru.json"
import { useSidebar } from "@/hooks/ui/use-sidebar"
import { cn } from "@/lib/utils/cn.util"

export function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon-sm"
      className={cn(className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeftIcon />
      <span className="sr-only">
        {localizedContent.copy.componentsUiSidebar.pereklyuchitBokovuyuPanel}
      </span>
    </Button>
  )
}
