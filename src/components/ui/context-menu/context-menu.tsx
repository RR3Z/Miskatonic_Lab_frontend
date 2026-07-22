"use client"

import { ContextMenu as ContextMenuPrimitive } from "radix-ui"

import type * as React from "react"

export function ContextMenu({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Root>) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />
}
