import type * as React from "react"

import {
  type ControlVariantProps,
  controlVariants,
} from "@/components/ui/styles/control-variants.styles"
import { cn } from "@/lib/utils/cn.util"

function Input({
  align = "start",
  className,
  size = "default",
  type,
  variant = "default",
  ...props
}: Omit<React.ComponentProps<"input">, "size"> & ControlVariantProps) {
  return (
    <input
      type={type}
      data-slot="input"
      data-align={align}
      data-size={size}
      data-variant={variant}
      className={cn(
        "w-full file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        controlVariants({ align, size, variant }),
        type === "number" &&
          "[appearance:textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
