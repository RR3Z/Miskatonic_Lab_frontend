import { cva } from "class-variance-authority"

export const alertVariants = cva(
  "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default:
          "border-[var(--ml-border-subtle)] bg-[var(--ml-surface-panel)] text-[var(--ml-ink-primary)]",
        destructive:
          "border-destructive/70 bg-destructive/10 text-[var(--ml-ink-primary)] [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)
