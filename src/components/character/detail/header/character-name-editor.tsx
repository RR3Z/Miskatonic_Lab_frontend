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
        className="gap-0 rounded-none border-0 px-0 py-0 hover:border-transparent hover:bg-transparent focus-visible:border-transparent focus-visible:outline-1 focus-visible:outline-[var(--ml-focus-ring)] focus-visible:outline-offset-2"
        displayClassName="truncate font-heading text-3xl font-semibold tracking-wide text-[var(--ml-ink-primary)]"
        errorMessage="Не удалось сохранить имя персонажа"
        inputClassName="h-10 px-0 font-heading text-2xl font-semibold"
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
