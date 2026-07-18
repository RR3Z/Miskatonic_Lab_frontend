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
import {
  characterNoteEditorHeightStorageKey,
  removeCharacterNoteEditorHeight,
} from "@/lib/utils/character-note-editor.util"
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
  const resizeStorageKey = note.id
    ? characterNoteEditorHeightStorageKey(characterId, note.id)
    : undefined

  async function deleteNote() {
    await deleteMutation.mutateAsync()
    if (note.id) removeCharacterNoteEditorHeight(characterId, note.id)
  }

  return (
    <article className="rounded-sm border border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel)]/70 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="flex items-start gap-2">
        <InlineTextEditor
          ariaLabel={`Редактировать заголовок заметки ${note.title}`}
          className="min-w-0 flex-1 py-1"
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
            onDelete={deleteNote}
            title="Удалить заметку?"
            variant="destructive"
          />
        ) : null}
      </div>
      <InlineTextEditor
        ariaLabel={`Редактировать текст заметки ${note.title}`}
        className="mt-0 !min-h-0 px-2 py-1"
        displayClassName="text-[var(--ml-ink-primary)]/90"
        errorMessage="Не удалось сохранить текст заметки"
        onSave={(body) =>
          updateMutation.mutateAsync({ body, title: note.title })
        }
        placeholder="Текст заметки"
        resizeStorageKey={resizeStorageKey}
        schema={characterNoteBodySchema}
        value={note.body}
      />
    </article>
  )
}
