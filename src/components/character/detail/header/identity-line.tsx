"use client"

import type { ZodType } from "zod"

import { InlineTextEditor } from "@/components/character/detail/editors/inline-text-editor"

export function IdentityLine({
  ariaLabel,
  label,
  onSave,
  schema,
  testId,
  value,
}: {
  ariaLabel: string
  label: string
  onSave: (value: string) => Promise<unknown>
  schema: ZodType<string>
  testId?: string
  value: number | string | null
}) {
  return (
    <div
      className="flex min-w-0 items-center gap-1 font-body text-sm leading-5 text-[var(--ml-ink-primary)]"
      data-testid={testId}
    >
      <span className="shrink-0 text-[var(--ml-ink-muted)]">{label}:</span>{" "}
      <InlineTextEditor
        ariaLabel={ariaLabel}
        className="min-w-0 flex-1 p-0"
        displayClassName="truncate whitespace-nowrap text-[var(--ml-ink-primary)]"
        errorMessage="Не удалось сохранить личные данные"
        inputClassName="h-7 px-1.5 py-0 text-sm"
        multiline={false}
        onSave={onSave}
        placeholder="—"
        schema={schema}
        value={value === null ? null : String(value)}
      />
    </div>
  )
}
