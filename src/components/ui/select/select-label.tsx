"use client"

import { Select as SelectPrimitive } from "radix-ui"

import type * as React from "react"

import { cn } from "@/lib/utils/cn.util"

export function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("px-1.5 py-1 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}
