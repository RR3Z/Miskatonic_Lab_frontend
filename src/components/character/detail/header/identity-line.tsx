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
        className="min-w-0 flex-1 gap-0 rounded-none border-0 px-0 py-0 hover:border-transparent hover:bg-transparent focus-visible:border-transparent focus-visible:outline-1 focus-visible:outline-[var(--ml-focus-ring)] focus-visible:outline-offset-1"
        displayClassName="truncate whitespace-nowrap leading-5 text-[var(--ml-ink-primary)]"
        errorMessage="Не удалось сохранить личные данные"
        inputClassName="h-6 px-0 py-0 text-sm"
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
