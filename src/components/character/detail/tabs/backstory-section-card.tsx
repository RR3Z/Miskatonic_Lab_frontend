"use client"

import { DeleteResourceButton } from "@/components/character/detail/editors/delete-resource-button"
import { InlineTextEditor } from "@/components/character/detail/editors/inline-text-editor"
import type { BackstorySection } from "@/components/character/detail/tabs/backstory-sections"
import { SHEET_CARD_CLASS_NAME } from "@/components/character/detail/tabs/sheet-card-classes"
import { characterBackstoryTextSchema } from "@/dto/character/character-backstory.dto"
import {
  useCreateCharacterBackstoryItem,
  useDeleteCharacterBackstoryItem,
  useUpdateCharacterBackstoryItem,
  useUpsertCharacterBackstory,
} from "@/lib/api/use-character-backstory"
import type { CharacterBackstory } from "@/types/character"

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
            ariaLabel={`Удалить раздел ${section.label}`}
            description={`Текст раздела «${section.label}» будет удалён.`}
            errorMessage="Не удалось удалить раздел истории"
            onDelete={() => deleteItem.mutateAsync()}
            title="Удалить раздел истории?"
          />
        ) : null}
      </div>
      <InlineTextEditor
        ariaLabel={`Редактировать раздел ${section.label}`}
        className="mt-1"
        errorMessage="Не удалось сохранить раздел истории"
        onSave={saveValue}
        placeholder="Нажмите, чтобы добавить текст"
        schema={characterBackstoryTextSchema}
        value={value ?? null}
      />
    </article>
  )
}
