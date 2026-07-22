import { cva, type VariantProps } from "class-variance-authority"

const controlVariants = cva(
  "min-w-0 border font-body text-[var(--ml-ink-primary)] outline-none transition-colors placeholder:text-[var(--ml-ink-muted)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 focus-visible:ring-3 focus-visible:ring-ring/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      variant: {
        default:
          "border-[var(--ml-border-aged)] bg-[color-mix(in_srgb,var(--ml-bg-page)_88%,black)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.45)] focus-visible:border-[var(--ml-focus-ring)] disabled:bg-[color-mix(in_srgb,var(--ml-bg-page)_65%,black)]",
        inline:
          "border-transparent bg-transparent shadow-none hover:border-[var(--ml-border-aged)] hover:bg-[var(--ml-surface-panel-raised)]/45 focus-visible:border-[var(--ml-focus-ring)]",
        accent:
          "border-[var(--ml-accent-brass-strong)]/65 bg-[color-mix(in_srgb,var(--ml-bg-page)_88%,black)] font-mono font-semibold text-[var(--ml-accent-aged-gold)] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.45)] focus-visible:border-[var(--ml-focus-ring)]",
      },
      size: {
        xs: "h-6 min-h-6 rounded-sm px-1.5 py-0 text-sm leading-5",
        sm: "min-h-7 rounded-sm px-2 py-0.5 text-sm",
        default: "min-h-8 rounded-lg px-2.5 py-1 text-sm",
        lg: "min-h-10 rounded-lg px-2 py-0 text-base",
      },
      align: {
        start: "text-left",
        center: "text-center",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      align: "start",
    },
  },
)

type ControlVariantProps = VariantProps<typeof controlVariants>

export { controlVariants }
export type { ControlVariantProps }
