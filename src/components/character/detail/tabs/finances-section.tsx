"use client"

import { DeleteResourceButton } from "@/components/character/detail/editors/delete-resource-button"
import { FinanceFieldsGrid } from "@/components/character/detail/tabs/finance-fields-grid"
import { SectionTitle } from "@/components/character/detail/tabs/section-title"
import { useDeleteCharacterFinances } from "@/lib/api/use-character-finances"
import type { CharacterFinances, CharacterSkill } from "@/types/character"

export function FinancesSection({
  characterId,
  finances,
  skills,
}: {
  characterId: string
  finances: CharacterFinances
  skills: CharacterSkill[] | null
}) {
  const deleteFinances = useDeleteCharacterFinances(characterId)

  return (
    <section className="space-y-3" data-testid="character-finances-content">
      <div className="flex items-center justify-between gap-3">
        <SectionTitle>Имущество</SectionTitle>
        {finances.id ? (
          <DeleteResourceButton
            ariaLabel="Удалить имущество"
            description="Денежные значения, активы и связь с кредитным рейтингом будут удалены."
            errorMessage="Не удалось удалить имущество"
            onDelete={() => deleteFinances.mutateAsync()}
            title="Удалить имущество?"
          />
        ) : null}
      </div>
      <FinanceFieldsGrid
        characterId={characterId}
        finances={finances}
        skills={skills}
      />
    </section>
  )
}
