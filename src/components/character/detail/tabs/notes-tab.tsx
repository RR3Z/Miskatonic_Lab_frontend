"use client"

import { Plus } from "lucide-react"
import { useState } from "react"

import { CharacterNoteCard } from "@/components/character/detail/notes/character-note-card"
import { CreateCharacterNoteDialog } from "@/components/character/detail/notes/create-character-note-dialog"
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
          className="shrink-0 border-[var(--ml-accent-brass-strong)]/70 bg-[color-mix(in_srgb,var(--ml-accent-brass-strong)_10%,transparent)] text-[var(--ml-accent-aged-gold)] hover:border-[var(--ml-accent-aged-gold)] hover:bg-[color-mix(in_srgb,var(--ml-accent-brass-strong)_20%,transparent)] hover:text-[var(--ml-ink-primary)]"
          disabled={isCreating}
          onClick={() => setIsCreating(true)}
          size="sm"
          type="button"
          variant="secondary"
        >
          <Plus aria-hidden="true" data-icon="inline-start" />
          Добавить заметку
        </Button>
      </div>

      <CreateCharacterNoteDialog
        characterId={characterId}
        onOpenChange={setIsCreating}
        open={isCreating}
      />

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
      ) : (
        <EmptySection>Заметок пока нет.</EmptySection>
      )}
    </div>
  )
}
