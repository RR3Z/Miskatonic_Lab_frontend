"use client"

import { DeleteResourceButton } from "@/components/character/detail/editors/delete-resource-button"
import { InlineTextEditor } from "@/components/character/detail/editors/inline-text-editor"
import type { BackstorySection } from "@/components/character/detail/tabs/constants/backstory-sections.constants"
import { SHEET_CARD_CLASS_NAME } from "@/components/character/detail/tabs/styles/sheet-card.styles"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"
import { formatLocalizedTemplate } from "@/data/locales/utils/format-localized-template.util"
import { characterBackstoryTextSchema } from "@/dto/character/character-backstory.dto"
import { useCreateCharacterBackstoryItem } from "@/hooks/character/use-create-character-backstory-item"
import { useDeleteCharacterBackstoryItem } from "@/hooks/character/use-delete-character-backstory-item"
import { useUpdateCharacterBackstoryItem } from "@/hooks/character/use-update-character-backstory-item"
import { useUpsertCharacterBackstory } from "@/hooks/character/use-upsert-character-backstory"
import type { CharacterBackstory } from "@/types/character.types"

export function BackstorySectionCard({
  backstory,
  characterId,
  section,
}: {
  backstory: CharacterBackstory
  characterId: string
  section: BackstorySection
}) {
  const item =
    section.key === "description"
      ? undefined
      : (backstory.items ?? []).find(
          (candidate) => candidate.section === section.key,
        )
  const itemId = item?.id ?? ""
  const upsertBackstory = useUpsertCharacterBackstory(characterId)
  const createItem = useCreateCharacterBackstoryItem(characterId)
  const updateItem = useUpdateCharacterBackstoryItem(characterId, itemId)
  const deleteItem = useDeleteCharacterBackstoryItem(characterId, itemId)
  const value =
    section.key === "description" ? backstory.personal_description : item?.text

  async function saveValue(text: string) {
    if (section.key === "description") {
      return upsertBackstory.mutateAsync({ personal_description: text })
    }

    const input = {
      section: section.key,
      text,
      title: section.label,
    }

    return item ? updateItem.mutateAsync(input) : createItem.mutateAsync(input)
  }

  return (
    <article
      className={`${SHEET_CARD_CLASS_NAME} min-h-28`}
      data-section={section.key}
      data-testid="backstory-section"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-body text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[var(--ml-accent-brass-strong)]">
          {section.label}
        </h3>
        {item ? (
          <DeleteResourceButton
            ariaLabel={formatLocalizedTemplate(
              localizedContent.copy.characterDetailTabsBackstorySectionCard
                .udalitRazdelValue0,
              { value0: section.label },
            )}
            description={formatLocalizedTemplate(
              localizedContent.copy.characterDetailTabsBackstorySectionCard
                .tekstRazdelaValue0BudetUdalen,
              { value0: section.label },
            )}
            errorMessage={
              localizedContent.copy.characterDetailTabsBackstorySectionCard
                .neUdalosUdalitRazdelIstorii
            }
            onDelete={() => deleteItem.mutateAsync()}
            title={
              localizedContent.copy.characterDetailTabsBackstorySectionCard
                .udalitRazdelIstorii
            }
          />
        ) : null}
      </div>
      <InlineTextEditor
        ariaLabel={formatLocalizedTemplate(
          localizedContent.copy.characterDetailTabsBackstorySectionCard
            .redaktirovatRazdelValue0,
          { value0: section.label },
        )}
        className="mt-1"
        errorMessage={
          localizedContent.copy.characterDetailTabsBackstorySectionCard
            .neUdalosSohranitRazdelIstorii
        }
        onSave={saveValue}
        placeholder={
          localizedContent.copy.characterDetailTabsBackstorySectionCard
            .nazhmiteChtobyDobavitTekst
        }
        schema={characterBackstoryTextSchema}
        value={value ?? null}
      />
    </article>
  )
}
