import type { VariantProps } from "class-variance-authority"

import type * as React from "react"
import { alertVariants } from "@/components/ui/alert/styles/alert.styles"
import { cn } from "@/lib/utils/cn.util"

export function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      className={cn(alertVariants({ variant }), className)}
      data-slot="alert"
      role="alert"
      {...props}
    />
  )
}
