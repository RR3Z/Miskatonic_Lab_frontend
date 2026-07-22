import type * as React from "react"

import { cn } from "@/lib/utils/cn.util"

export function AlertAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "col-start-2 mt-2 flex items-center justify-start",
        className,
      )}
      data-slot="alert-action"
      {...props}
    />
  )
}
