"use client"

import type { ZodType } from "zod"

import { InlineTextEditor } from "@/components/character/detail/editors/inline-text-editor"

export function CompactStat({
  ariaLabel,
  label,
  onSave,
  schema,
  title,
  value,
}: {
  ariaLabel: string
  label: string
  onSave: (value: string) => Promise<unknown>
  schema: ZodType<string>
  title?: string
  value: number | string | null
}) {
  return (
    <div
      className="flex min-h-0 min-w-0 flex-col items-center justify-center rounded-sm border border-[var(--ml-border-subtle)] bg-[var(--ml-bg-page)]/25 px-2 py-1 text-center"
      title={title}
    >
      <span className="block w-full min-w-0 truncate font-body text-[0.65rem] uppercase tracking-[0.12em] text-[var(--ml-ink-muted)]">
        {label}
      </span>
      <InlineTextEditor
        ariaLabel={ariaLabel}
        className="w-full p-0"
        displayClassName="text-center font-mono text-base font-semibold tabular-nums text-[var(--ml-ink-primary)]"
        errorMessage="Не удалось сохранить показатель"
        inputClassName="h-7 px-1 text-center font-mono text-sm"
        multiline={false}
        onSave={onSave}
        placeholder="—"
        schema={schema}
        value={value === null ? null : String(value)}
      />
    </div>
  )
}
