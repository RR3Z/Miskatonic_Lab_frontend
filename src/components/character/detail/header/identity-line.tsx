"use client"

import type { ComponentProps, ReactNode } from "react"
import type { ZodType } from "zod"

import { InlineTextEditor } from "@/components/character/detail/editors/inline-text-editor"

export function IdentityLine({
  ariaLabel,
  className,
  labelAccessory,
  label,
  inputMode,
  inputPattern,
  normalizeInput,
  onSave,
  schema,
  testId,
  value,
}: {
  ariaLabel: string
  className?: string
  labelAccessory?: ReactNode
  label: string
  inputMode?: ComponentProps<"input">["inputMode"]
  inputPattern?: string
  normalizeInput?: (value: string) => string
  onSave: (value: string) => Promise<unknown>
  schema: ZodType<string>
  testId?: string
  value: number | string | null
}) {
  return (
    <div
      className={`flex min-w-0 items-center gap-1 font-body text-sm leading-5 text-[var(--ml-ink-primary)] ${className ?? ""}`}
      data-testid={testId}
    >
      <span className="inline-flex shrink-0 items-center gap-1 text-[var(--ml-ink-muted)]">
        <span>{label}</span>
        {labelAccessory}
        <span>: </span>
      </span>
      <InlineTextEditor
        ariaLabel={ariaLabel}
        className="h-6 min-w-0 flex-1 items-center gap-0 rounded-sm px-1.5 py-0"
        displayClassName="truncate whitespace-nowrap leading-5 text-[var(--ml-ink-primary)]"
        errorMessage="Не удалось сохранить личные данные"
        inputClassName="h-6 px-1.5 py-0 text-sm leading-5"
        inputMode={inputMode}
        inputPattern={inputPattern}
        multiline={false}
        normalizeInput={normalizeInput}
        onSave={onSave}
        placeholder="—"
        schema={schema}
        showEditIcon={false}
        value={value === null ? null : String(value)}
      />
    </div>
  )
}
