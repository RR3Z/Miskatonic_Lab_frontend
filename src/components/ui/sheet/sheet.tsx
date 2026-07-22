"use client"

import { Dialog as SheetPrimitive } from "radix-ui"

import type * as React from "react"

export function Sheet({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}
