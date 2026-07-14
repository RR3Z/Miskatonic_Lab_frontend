import { Plus } from "lucide-react"

import { CharacterSkillRow } from "@/components/character/detail/skills/character-skill-row"
import { groupCharacterSkills } from "@/components/character/detail/skills/group-character-skills"
import type { CharacterSkill } from "@/types/character"

export function CharacterSkills({
  skills,
}: {
  skills: CharacterSkill[] | null
}) {
  const groups = groupCharacterSkills(skills ?? [])

  return (
    <section className="min-h-full" data-testid="character-skills">
      <div className="mb-4 flex items-center justify-between gap-4 border-b border-[var(--ml-border-subtle)] pb-2">
        <h2 className="font-heading text-xl font-semibold tracking-wide text-[var(--ml-ink-primary)]">
          Навыки
        </h2>
        <button
          aria-label="Добавить собственный навык"
          className="grid size-7 shrink-0 place-items-center rounded-sm border border-[var(--ml-border-aged)] text-[var(--ml-ink-muted)] opacity-60"
          disabled
          title="Добавление собственных навыков появится в будущем"
          type="button"
        >
          <Plus aria-hidden="true" className="size-4" />
        </button>
      </div>

      {groups.length === 0 ? (
        <p className="rounded-sm border border-dashed border-[var(--ml-border-subtle)] px-4 py-8 text-center font-body text-sm text-[var(--ml-ink-muted)]">
          Навыки персонажа пока не добавлены.
        </p>
      ) : (
        <div className="columns-2 gap-4" data-testid="character-skill-groups">
          {groups.map((group) => (
            <section
              aria-label={`Навыки на букву ${group.initial}`}
              className="mb-4 break-inside-avoid"
              data-testid="character-skill-group"
              key={group.initial}
            >
              <div className="mb-1.5 flex items-center gap-2">
                <h3 className="font-heading text-lg font-semibold text-[var(--ml-accent-brass-strong)]">
                  {group.initial}
                </h3>
                <span
                  aria-hidden="true"
                  className="h-px flex-1 bg-[var(--ml-border-aged)]/70"
                />
              </div>
              <ul className="space-y-1.5">
                {group.skills.map((skill) => (
                  <CharacterSkillRow key={skill.id} skill={skill} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </section>
  )
}
