import type { ComponentProps } from "react"
import type { ZodType } from "zod"

export type InlineTextEditorProps = {
  ariaLabel: string
  className?: string
  displayClassName?: string
  errorMessage: string
  inputClassName?: string
  inputMode?: ComponentProps<"input">["inputMode"]
  inputPattern?: string
  maxLength?: number
  multiline?: boolean
  normalizeInput?: (value: string) => string
  onSave: (value: string) => Promise<unknown>
  placeholder: string
  schema: ZodType<string>
  showEditIcon?: boolean
  value: string | null
}
