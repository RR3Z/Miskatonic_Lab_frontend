"use client"

import { InlineTextEditor } from "@/components/character/detail/editors/inline-text-editor"
import { FinanceCard } from "@/components/character/detail/tabs/finance-card"
import { CHARACTER_FINANCE_FIELDS } from "@/components/character/detail/tabs/finance-field-definitions"
import { useUpdateCharacterFinances } from "@/lib/api/use-character-finances"
import type { CharacterFinances } from "@/types/character"

export function FinanceFieldsGrid({
  characterId,
  finances,
}: {
  characterId: string
  finances: CharacterFinances
}) {
  const updateFinances = useUpdateCharacterFinances(characterId)

  return (
    <div className="grid grid-cols-2 gap-3">
      {CHARACTER_FINANCE_FIELDS.map((field) => (
        <FinanceCard
          className={field.className}
          key={field.key}
          label={field.label}
          value={
            <InlineTextEditor
              ariaLabel={`Редактировать поле ${field.label}`}
              errorMessage="Не удалось сохранить финансы"
              multiline={field.multiline}
              onSave={(value) =>
                updateFinances.mutateAsync({ [field.key]: value })
              }
              placeholder={field.placeholder}
              schema={field.schema}
              value={finances[field.key]}
            />
          }
        />
      ))}
    </div>
  )
}
