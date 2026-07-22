import type { ComponentProps } from "react"

import { Button } from "@/components/ui/button"

type RuleButtonProps = ComponentProps<typeof Button>

export function RuleButton({ children, ...props }: RuleButtonProps) {
  return (
    <Button {...props} size="lg" type="button" variant="accent">
      {children}
    </Button>
  )
}
