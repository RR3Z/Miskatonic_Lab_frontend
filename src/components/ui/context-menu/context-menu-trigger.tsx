"use client"

import { ContextMenu as ContextMenuPrimitive } from "radix-ui"

import type * as React from "react"

export function ContextMenuTrigger({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) {
  return (
    <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />
  )
}
