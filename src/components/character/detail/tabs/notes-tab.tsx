import { CreateCharacterNoteDialog } from "@/components/character/detail/notes/create-character-note-dialog"
import { ContentCard } from "@/components/character/detail/tabs/content-card"
import { EmptySection } from "@/components/character/detail/tabs/empty-section"
import { SectionTitle } from "@/components/character/detail/tabs/section-title"
import type { CharacterNote } from "@/types/character"

export function NotesTab({
  characterId,
  notes,
}: {
  characterId: string
  notes: CharacterNote[] | null
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <SectionTitle>Заметки</SectionTitle>
        <CreateCharacterNoteDialog characterId={characterId} />
      </div>

      {notes?.length ? (
        <div className="space-y-3" data-testid="character-notes-content">
          {notes.map((note) => (
            <ContentCard key={note.id ?? note.title} title={note.title}>
              {note.body}
            </ContentCard>
          ))}
        </div>
      ) : (
        <EmptySection>Заметок пока нет.</EmptySection>
      )}
    </div>
  )
}
