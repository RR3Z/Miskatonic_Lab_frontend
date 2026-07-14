"use client"

import { Plus } from "lucide-react"
import { useState } from "react"

import { CharacterNoteCard } from "@/components/character/detail/notes/character-note-card"
import { CreateCharacterNoteForm } from "@/components/character/detail/notes/create-character-note-form"
import { EmptySection } from "@/components/character/detail/tabs/empty-section"
import { SectionTitle } from "@/components/character/detail/tabs/section-title"
import { Button } from "@/components/ui/button"
import type { CharacterNote } from "@/types/character"

export function NotesTab({
  characterId,
  notes,
}: {
  characterId: string
  notes: CharacterNote[] | null
}) {
  const [isCreating, setIsCreating] = useState(false)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <SectionTitle>Заметки</SectionTitle>
        <Button
          disabled={isCreating}
          onClick={() => setIsCreating(true)}
          size="sm"
          type="button"
          variant="default"
        >
          <Plus aria-hidden="true" data-icon="inline-start" />
          Добавить заметку
        </Button>
      </div>

      {isCreating ? (
        <CreateCharacterNoteForm
          characterId={characterId}
          onCancel={() => setIsCreating(false)}
          onCreated={() => setIsCreating(false)}
        />
      ) : null}

      {notes?.length ? (
        <div className="space-y-3" data-testid="character-notes-content">
          {notes.map((note) => (
            <CharacterNoteCard
              characterId={characterId}
              key={note.id ?? note.title}
              note={note}
            />
          ))}
        </div>
      ) : isCreating ? null : (
        <EmptySection>Заметок пока нет.</EmptySection>
      )}
    </div>
  )
}
