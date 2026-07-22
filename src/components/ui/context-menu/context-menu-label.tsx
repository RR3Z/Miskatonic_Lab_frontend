"use client"

import { ContextMenu as ContextMenuPrimitive } from "radix-ui"

import type * as React from "react"
import { cn } from "@/lib/utils/cn.util"

export function ContextMenuLabel({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Label>) {
  return (
    <ContextMenuPrimitive.Label
      data-slot="context-menu-label"
      className={cn(
        "px-2 py-1 text-xs font-medium tracking-wide text-muted-foreground",
        className,
      )}
      {...props}
    />
  )
}
