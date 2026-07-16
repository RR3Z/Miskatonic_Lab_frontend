"use client"

import { InlineTextEditor } from "@/components/character/detail/editors/inline-text-editor"
import { characterNameSchema } from "@/dto/character/character-profile.dto"

export function CharacterNameEditor({
  name,
  onSave,
}: {
  name: string
  onSave: (name: string) => Promise<unknown>
}) {
  return (
    <h1 aria-label={name}>
      <InlineTextEditor
        ariaLabel="Редактировать имя персонажа"
        className="min-h-10"
        displayClassName="truncate font-heading text-3xl leading-none font-semibold tracking-wide text-[var(--ml-ink-primary)]"
        errorMessage="Не удалось сохранить имя персонажа"
        inputClassName="font-heading text-3xl leading-none font-semibold md:text-3xl"
        inputSize="lg"
        multiline={false}
        onSave={onSave}
        placeholder="Имя персонажа"
        schema={characterNameSchema}
        showEditIcon={false}
        value={name}
      />
    </h1>
  )
}
