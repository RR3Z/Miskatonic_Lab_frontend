import type { ComponentProps } from "react"

import { Button } from "@/components/ui/button"

type ResourceAdjustButtonProps = ComponentProps<typeof Button>

export function ResourceAdjustButton({
  children,
  ...props
}: ResourceAdjustButtonProps) {
  return (
    <Button {...props} size="icon-xs" type="button" variant="secondary">
      {children}
    </Button>
  )
}
