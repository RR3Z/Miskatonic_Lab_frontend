"use client"

import { Dialog as SheetPrimitive } from "radix-ui"

import type * as React from "react"

import { cn } from "@/lib/utils/cn.util"

export function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        "font-heading text-base font-medium text-foreground",
        className,
      )}
      {...props}
    />
  )
}
