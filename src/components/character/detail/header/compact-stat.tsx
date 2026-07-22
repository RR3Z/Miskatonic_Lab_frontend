"use client"

import type { ZodType } from "zod"
import { InlineTextEditor } from "@/components/character/detail/editors/inline-text-editor"
import { CharacterSheetStatCard } from "@/components/character/detail/header/character-sheet-stat/character-sheet-stat-card"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"

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
    <CharacterSheetStatCard
      className="flex flex-col items-center justify-center px-2 py-1"
      title={title}
    >
      <span className="block w-full min-w-0 truncate font-body text-[0.65rem] uppercase tracking-[0.12em] text-[var(--ml-ink-muted)]">
        {label}
      </span>
      <InlineTextEditor
        ariaLabel={ariaLabel}
        className="w-full p-0"
        displayClassName="text-center font-mono text-base font-semibold tabular-nums text-[var(--ml-ink-primary)]"
        errorMessage={
          localizedContent.copy.characterDetailHeaderCompactStat
            .neUdalosSohranitPokazatel
        }
        inputAlign="center"
        inputClassName="font-mono text-sm"
        inputSize="sm"
        multiline={false}
        onSave={onSave}
        placeholder={localizedContent.copy.characterDetailCommon.emptyValue}
        schema={schema}
        value={value === null ? null : String(value)}
      />
    </CharacterSheetStatCard>
  )
}
