"use client"

import { DeleteResourceButton } from "@/components/character/detail/editors/delete-resource-button"
import { FinanceFieldsGrid } from "@/components/character/detail/tabs/finance-fields-grid"
import { SectionTitle } from "@/components/character/detail/tabs/section-title"
import { useDeleteCharacterFinances } from "@/lib/api/use-character-finances"
import type { CharacterFinances } from "@/types/character"

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
        <SectionTitle>Финансы</SectionTitle>
        {finances.id ? (
          <DeleteResourceButton
            ariaLabel="Удалить финансы"
            description="Карманные деньги, наличные и активы будут удалены."
            errorMessage="Не удалось удалить финансы"
            onDelete={() => deleteFinances.mutateAsync()}
            title="Удалить финансы?"
          />
        ) : null}
      </div>
      <FinanceFieldsGrid characterId={characterId} finances={finances} />
    </section>
  )
}
