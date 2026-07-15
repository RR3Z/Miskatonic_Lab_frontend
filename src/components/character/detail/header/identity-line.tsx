"use client"

import type { ReactNode } from "react"
import type { ZodType } from "zod"

import { InlineTextEditor } from "@/components/character/detail/editors/inline-text-editor"

export function IdentityLine({
  ariaLabel,
  className,
  labelAccessory,
  label,
  onSave,
  schema,
  testId,
  value,
}: {
  ariaLabel: string
  className?: string
  labelAccessory?: ReactNode
  label: string
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
      <span className="shrink-0 text-[var(--ml-ink-muted)]">{label}:</span>{" "}
      {labelAccessory}
      <InlineTextEditor
        ariaLabel={ariaLabel}
        className="h-6 min-w-0 flex-1 items-center gap-0 rounded-sm px-1.5 py-0"
        displayClassName="truncate whitespace-nowrap leading-5 text-[var(--ml-ink-primary)]"
        errorMessage="Не удалось сохранить личные данные"
        inputClassName="h-6 px-1.5 py-0 text-sm leading-5"
        multiline={false}
        onSave={onSave}
        placeholder="—"
        schema={schema}
        showEditIcon={false}
        value={value === null ? null : String(value)}
      />
    </div>
  )
}
