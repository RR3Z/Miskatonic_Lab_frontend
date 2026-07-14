import type { BackstorySection } from "@/components/character/detail/tabs/backstory-sections"
import { SHEET_CARD_CLASS_NAME } from "@/components/character/detail/tabs/sheet-card-classes"
import type { CharacterBackstory } from "@/types/character"

export function BackstorySectionCard({
  backstory,
  section,
}: {
  backstory: CharacterBackstory
  section: BackstorySection
}) {
  const items =
    section.key === "description"
      ? []
      : (backstory.items ?? []).filter((item) => item.section === section.key)
  const isEmpty =
    section.key === "description"
      ? !backstory.personal_description
      : !items.length

  return (
    <div
      className={`${SHEET_CARD_CLASS_NAME} min-h-28`}
      data-section={section.key}
      data-testid="backstory-section"
    >
      <h3 className="font-body text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[var(--ml-accent-brass-strong)]">
        {section.label}
      </h3>
      {isEmpty ? (
        <p className="mt-3 font-body text-sm text-[var(--ml-ink-muted)]">—</p>
      ) : section.key === "description" ? (
        <p className="mt-2 whitespace-pre-wrap font-body text-sm leading-6 text-[var(--ml-ink-muted)]">
          {backstory.personal_description}
        </p>
      ) : (
        <div className="mt-2 space-y-2">
          {items.map((item) => (
            <div className="font-body text-sm leading-5" key={item.id}>
              <p className="font-semibold text-[var(--ml-ink-primary)]">
                {item.title}
              </p>
              <p className="whitespace-pre-wrap text-[var(--ml-ink-muted)]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
