"use client"

import { ChevronDownIcon } from "lucide-react"

import { Select as SelectPrimitive } from "radix-ui"

import type * as React from "react"

import {
  type ControlVariantProps,
  controlVariants,
} from "@/components/ui/styles/control-variants.styles"

import { cn } from "@/lib/utils/cn.util"

export function SelectTrigger({
  align = "start",
  className,
  size = "default",
  children,
  variant = "default",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: NonNullable<ControlVariantProps["size"]>
} & ControlVariantProps) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-align={align}
      data-size={size}
      data-variant={variant}
      className={cn(
        "flex w-fit cursor-pointer items-center justify-between gap-1.5 pr-2 whitespace-nowrap select-none data-placeholder:text-[var(--ml-ink-muted)] *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        controlVariants({ align, size, variant }),
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}
