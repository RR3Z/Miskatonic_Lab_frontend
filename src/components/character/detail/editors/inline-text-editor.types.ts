import type { ZodType } from "zod"

export type InlineTextEditorProps = {
  ariaLabel: string
  className?: string
  displayClassName?: string
  errorMessage: string
  inputClassName?: string
  maxLength?: number
  multiline?: boolean
  onSave: (value: string) => Promise<unknown>
  placeholder: string
  schema: ZodType<string>
  value: string | null
}
