"use client"

import { DeleteResourceButton } from "@/components/character/detail/editors/delete-resource-button"
import { InlineTextEditor } from "@/components/character/detail/editors/inline-text-editor"
import {
  characterNoteBodySchema,
  characterNoteTitleSchema,
  MAX_CHARACTER_NOTE_TITLE_LENGTH,
} from "@/dto/character/create-character-note.dto"
import {
  useDeleteCharacterNote,
  useUpdateCharacterNote,
} from "@/lib/api/use-character-notes"
import type { CharacterNote } from "@/types/character"

export function CharacterNoteCard({
  characterId,
  note,
}: {
  characterId: string
  note: CharacterNote
}) {
  const noteId = note.id ?? ""
  const updateMutation = useUpdateCharacterNote(characterId, noteId)
  const deleteMutation = useDeleteCharacterNote(characterId, noteId)

  return (
    <article className="rounded-sm border border-[var(--ml-border-subtle)] bg-[var(--ml-bg-page)]/20 p-3">
      <div className="flex items-start gap-2">
        <InlineTextEditor
          ariaLabel={`Редактировать заголовок заметки ${note.title}`}
          className="min-w-0 flex-1"
          displayClassName="font-heading text-base font-semibold text-[var(--ml-ink-primary)]"
          errorMessage="Не удалось сохранить заголовок"
          inputClassName="font-heading font-semibold"
          maxLength={MAX_CHARACTER_NOTE_TITLE_LENGTH}
          multiline={false}
          onSave={(title) =>
            updateMutation.mutateAsync({ body: note.body, title })
          }
          placeholder="Заголовок заметки"
          schema={characterNoteTitleSchema}
          value={note.title}
        />
        {note.id ? (
          <DeleteResourceButton
            ariaLabel={`Удалить заметку ${note.title}`}
            description={`Заметка «${note.title}» будет удалена без возможности восстановления.`}
            errorMessage="Не удалось удалить заметку"
            onDelete={() => deleteMutation.mutateAsync()}
            title="Удалить заметку?"
          />
        ) : null}
      </div>
      <InlineTextEditor
        ariaLabel={`Редактировать текст заметки ${note.title}`}
        className="mt-1"
        errorMessage="Не удалось сохранить текст заметки"
        onSave={(body) =>
          updateMutation.mutateAsync({ body, title: note.title })
        }
        placeholder="Текст заметки"
        schema={characterNoteBodySchema}
        value={note.body}
      />
    </article>
  )
}
