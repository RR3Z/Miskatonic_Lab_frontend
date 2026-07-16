import type * as React from "react"

import { cn } from "@/lib/utils/cn.util"

function Checkbox({
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "type">) {
  return (
    <input
      {...props}
      className={cn(
        "size-4 rounded-[2px] border border-[var(--ml-border-aged)] accent-[var(--ml-accent-brass-strong)]",
        className,
      )}
      type="checkbox"
    />
  )
}

export { Checkbox }
