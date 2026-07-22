"use client"

import { InlineTextEditor } from "@/components/character/detail/editors/inline-text-editor"
import { CHARACTER_FINANCE_FIELDS } from "@/components/character/detail/tabs/constants/finance-fields.constants"
import { FinanceCard } from "@/components/character/detail/tabs/finance-card"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"
import { formatLocalizedTemplate } from "@/data/locales/utils/format-localized-template.util"
import { useUpdateCharacterFinances } from "@/hooks/character/use-update-character-finances"
import type { CharacterFinances } from "@/types/character.types"

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
              ariaLabel={formatLocalizedTemplate(
                localizedContent.copy.characterDetailTabsFinanceFieldsGrid
                  .redaktirovatPoleValue0,
                { value0: field.label },
              )}
              errorMessage={
                localizedContent.copy.characterDetailTabsFinanceFieldsGrid
                  .neUdalosSohranitFinansy
              }
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
