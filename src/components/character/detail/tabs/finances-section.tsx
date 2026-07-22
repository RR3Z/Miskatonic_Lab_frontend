"use client"

import { DeleteResourceButton } from "@/components/character/detail/editors/delete-resource-button"
import { FinanceFieldsGrid } from "@/components/character/detail/tabs/finance-fields-grid"
import { SectionTitle } from "@/components/character/detail/tabs/section-title"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"
import { useDeleteCharacterFinances } from "@/hooks/character/use-delete-character-finances"
import type { CharacterFinances } from "@/types/character.types"

export function FinancesSection({
  characterId,
  finances,
}: {
  characterId: string
  finances: CharacterFinances
}) {
  const deleteFinances = useDeleteCharacterFinances(characterId)

  return (
    <section className="space-y-3" data-testid="character-finances-content">
      <div className="flex items-center justify-between gap-3">
        <SectionTitle>
          {localizedContent.copy.characterDetailTabsFinancesSection.finansy}
        </SectionTitle>
        {finances.id ? (
          <DeleteResourceButton
            ariaLabel={
              localizedContent.copy.characterDetailTabsFinancesSection
                .udalitFinansy
            }
            description={
              localizedContent.copy.characterDetailTabsFinancesSection
                .karmannyeDengiNalichnyeIAktivyBudut
            }
            errorMessage={
              localizedContent.copy.characterDetailTabsFinancesSection
                .neUdalosUdalitFinansy
            }
            onDelete={() => deleteFinances.mutateAsync()}
            title={
              localizedContent.copy.characterDetailTabsFinancesSection
                .udalitFinansy2
            }
          />
        ) : null}
      </div>
      <FinanceFieldsGrid characterId={characterId} finances={finances} />
    </section>
  )
}
