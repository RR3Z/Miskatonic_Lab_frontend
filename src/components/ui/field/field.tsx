"use client"

import type { VariantProps } from "class-variance-authority"

import { fieldVariants } from "@/components/ui/field/styles/field.styles"
import { cn } from "@/lib/utils/cn.util"

export function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  )
}
