import * as React from "react"

import {
  type ControlVariantProps,
  controlVariants,
} from "@/components/ui/control-variants"
import { cn } from "@/lib/utils/cn.util"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea"> & ControlVariantProps
>(function Textarea(
  {
    align = "start",
    className,
    size = "default",
    variant = "default",
    ...props
  },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex w-full resize-y",
        controlVariants({ align, size, variant }),
        "min-h-24 data-[size=xs]:min-h-16 data-[size=sm]:min-h-20 data-[size=lg]:min-h-32",
        className,
      )}
      data-slot="textarea"
      data-align={align}
      data-size={size}
      data-variant={variant}
      {...props}
    />
  )
})

export { Textarea }
