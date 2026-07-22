import type { ComponentProps } from "react"
import type { ZodType } from "zod"
import type { ControlVariantProps } from "@/components/ui/styles/control-variants.styles"

export type InlineTextEditorProps = {
  ariaLabel: string
  className?: string
  displayClassName?: string
  errorMessage: string
  inputAlign?: NonNullable<ControlVariantProps["align"]>
  inputClassName?: string
  inputMode?: ComponentProps<"input">["inputMode"]
  inputPattern?: string
  inputSize?: NonNullable<ControlVariantProps["size"]>
  inputVariant?: NonNullable<ControlVariantProps["variant"]>
  maxLength?: number
  multiline?: boolean
  normalizeInput?: (value: string) => string
  onSave: (value: string) => Promise<unknown>
  placeholder: string
  resizeStorageKey?: string
  schema: ZodType<string>
  showEditIcon?: boolean
  value: string | null
}
