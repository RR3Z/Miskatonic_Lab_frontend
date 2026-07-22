import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import type * as React from "react"

import { cn } from "@/lib/utils/cn.util"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm leading-none font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:cursor-default disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--ml-ink-on-paper)] text-[var(--ml-surface-paper)] hover:bg-[#2b2519]",
        outline:
          "border-[var(--ml-ink-on-paper)] bg-transparent text-[var(--ml-ink-on-paper)] hover:border-[var(--ml-accent-brass-strong)] hover:bg-[var(--ml-accent-brass-strong)] hover:text-[var(--ml-ink-on-paper)]",
        secondary:
          "border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel-raised)] text-[var(--ml-ink-primary)] hover:border-[var(--ml-accent-brass-strong)] hover:bg-[var(--ml-surface-panel)] hover:text-[var(--ml-accent-aged-gold)] aria-expanded:bg-[var(--ml-surface-panel)]",
        accent:
          "border-[var(--ml-accent-brass-strong)]/80 bg-[linear-gradient(180deg,rgba(92,73,45,0.75),rgba(50,41,29,0.9))] text-[var(--ml-ink-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-[var(--ml-accent-aged-gold)] hover:bg-[var(--ml-surface-panel-raised)] disabled:border-[var(--ml-border-subtle)] disabled:bg-transparent disabled:text-[var(--ml-ink-muted)] disabled:opacity-40",
        ghost:
          "border-transparent bg-transparent text-[var(--ml-ink-muted)] hover:bg-[color-mix(in_srgb,var(--ml-surface-panel)_60%,transparent)] hover:text-[var(--ml-ink-primary)]",
        destructive:
          "border-destructive/80 bg-destructive text-[#f4f1ea] hover:bg-[color-mix(in_srgb,var(--destructive)_86%,white)] focus-visible:border-destructive focus-visible:ring-destructive/30",
        success:
          "border-[color-mix(in_srgb,var(--ml-accent-success)_80%,black)] bg-[var(--ml-accent-success)] text-[#f4f1ea] hover:bg-[color-mix(in_srgb,var(--ml-accent-success)_86%,white)] focus-visible:border-[var(--ml-accent-success)] focus-visible:ring-[color-mix(in_srgb,var(--ml-accent-success)_35%,transparent)]",
        link: "text-primary underline-offset-4 hover:underline",
        unstyled: "",
      },
      size: {
        default:
          "h-8 gap-1.5 rounded-md px-3 font-body text-base has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8 rounded-md",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
        content: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
