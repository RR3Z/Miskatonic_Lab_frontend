"use client"

import { DeleteResourceButton } from "@/components/character/detail/editors/delete-resource-button"
import { InlineTextEditor } from "@/components/character/detail/editors/inline-text-editor"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"
import { formatLocalizedTemplate } from "@/data/locales/utils/format-localized-template.util"
import {
  characterNoteBodySchema,
  characterNoteTitleSchema,
  MAX_CHARACTER_NOTE_TITLE_LENGTH,
} from "@/dto/character/create-character-note.dto"
import { useDeleteCharacterNote } from "@/hooks/character/use-delete-character-note"
import { useUpdateCharacterNote } from "@/hooks/character/use-update-character-note"
import {
  characterNoteEditorHeightStorageKey,
  removeCharacterNoteEditorHeight,
} from "@/lib/utils/character-note-editor.util"
import type { CharacterNote } from "@/types/character.types"

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
          ariaLabel={formatLocalizedTemplate(
            localizedContent.copy.characterDetailNotesCharacterNoteCard
              .redaktirovatZagolovokZametkiValue0,
            { value0: note.title },
          )}
          className="min-w-0 flex-1 py-1"
          displayClassName="font-heading text-base font-semibold text-[var(--ml-ink-primary)]"
          errorMessage={
            localizedContent.copy.characterDetailNotesCharacterNoteCard
              .neUdalosSohranitZagolovok
          }
          inputClassName="font-heading font-semibold"
          maxLength={MAX_CHARACTER_NOTE_TITLE_LENGTH}
          multiline={false}
          onSave={(title) =>
            updateMutation.mutateAsync({ body: note.body, title })
          }
          placeholder={
            localizedContent.copy.characterDetailNotesCharacterNoteCard
              .zagolovokZametki
          }
          schema={characterNoteTitleSchema}
          value={note.title}
        />
        {note.id ? (
          <DeleteResourceButton
            ariaLabel={formatLocalizedTemplate(
              localizedContent.copy.characterDetailNotesCharacterNoteCard
                .udalitZametkuValue0,
              { value0: note.title },
            )}
            description={formatLocalizedTemplate(
              localizedContent.copy.characterDetailNotesCharacterNoteCard
                .zametkaValue0BudetUdalenaBezVozmozhnosti,
              { value0: note.title },
            )}
            errorMessage={
              localizedContent.copy.characterDetailNotesCharacterNoteCard
                .neUdalosUdalitZametku
            }
            onDelete={deleteNote}
            title={
              localizedContent.copy.characterDetailNotesCharacterNoteCard
                .udalitZametku
            }
            variant="destructive"
          />
        ) : null}
      </div>
      <InlineTextEditor
        ariaLabel={formatLocalizedTemplate(
          localizedContent.copy.characterDetailNotesCharacterNoteCard
            .redaktirovatTekstZametkiValue0,
          { value0: note.title },
        )}
        className="mt-0 !min-h-0 px-2 py-1"
        displayClassName="text-[var(--ml-ink-primary)]/90"
        errorMessage={
          localizedContent.copy.characterDetailNotesCharacterNoteCard
            .neUdalosSohranitTekstZametki
        }
        onSave={(body) =>
          updateMutation.mutateAsync({ body, title: note.title })
        }
        placeholder={
          localizedContent.copy.characterDetailNotesCharacterNoteCard
            .tekstZametki
        }
        resizeStorageKey={resizeStorageKey}
        schema={characterNoteBodySchema}
        value={note.body}
      />
    </article>
  )
}
