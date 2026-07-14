import { BackstorySectionCard } from "@/components/character/detail/tabs/backstory-section-card"
import { BACKSTORY_SECTIONS } from "@/components/character/detail/tabs/backstory-sections"
import { EditableSectionHeader } from "@/components/character/detail/tabs/editable-section-header"
import type { CharacterBackstory } from "@/types/character"

export function HistorySection({
  backstory,
}: {
  backstory: CharacterBackstory
}) {
  return (
    <section className="space-y-3" data-testid="character-history-content">
      <EditableSectionHeader
        editLabel="Редактировать биографию"
        title="Биография"
        tooltip="Редактирование биографии будет добавлено позже"
      />
      <div className="grid grid-cols-2 gap-3">
        {BACKSTORY_SECTIONS.map((section) => (
          <BackstorySectionCard
            backstory={backstory}
            key={section.key}
            section={section}
          />
        ))}
      </div>
    </section>
  )
}
