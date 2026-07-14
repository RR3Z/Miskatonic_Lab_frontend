import { Check, Plus } from "lucide-react"

import { cn } from "@/lib/utils/cn.util"
import type { CharacterSkill } from "@/types/character"

type CharacterSkillsProps = {
  skills: CharacterSkill[] | null
}

type CharacterSkillGroup = {
  initial: string
  skills: CharacterSkill[]
}

const skillCollator = new Intl.Collator("ru-RU", {
  numeric: true,
  sensitivity: "base",
})

function getSkillInitial(name: string) {
  const initial = Array.from(name.trim())[0]
  return initial ? initial.toLocaleUpperCase("ru-RU") : "#"
}

export function groupCharacterSkills(
  skills: CharacterSkill[],
): CharacterSkillGroup[] {
  const groups = new Map<string, CharacterSkill[]>()
  const sortedSkills = [...skills].sort((left, right) =>
    skillCollator.compare(left.name, right.name),
  )

  for (const skill of sortedSkills) {
    const initial = getSkillInitial(skill.name)
    const group = groups.get(initial)

    if (group) group.push(skill)
    else groups.set(initial, [skill])
  }

  return [...groups]
    .sort(([left], [right]) => skillCollator.compare(left, right))
    .map(([initial, groupedSkills]) => ({
      initial,
      skills: groupedSkills,
    }))
}

function SkillDevelopmentMark({ checked }: { checked: boolean }) {
  return (
    <span
      aria-label={checked ? "Отмечен для развития" : "Не отмечен для развития"}
      className={cn(
        "grid size-4 shrink-0 place-items-center rounded-[2px] border",
        checked
          ? "border-[var(--ml-accent-brass-strong)] bg-[var(--ml-accent-brass-strong)]/20 text-[var(--ml-accent-brass-strong)]"
          : "border-[var(--ml-border-aged)] text-transparent",
      )}
      role="img"
    >
      <Check aria-hidden="true" className="size-3" strokeWidth={2.5} />
    </span>
  )
}

function CharacterSkillRow({ skill }: { skill: CharacterSkill }) {
  return (
    <li
      className="flex min-w-0 items-center gap-2 rounded-sm border border-[var(--ml-border-subtle)] bg-[var(--ml-bg-page)]/20 px-2 py-1.5"
      data-testid="character-skill"
      title={skill.category || undefined}
    >
      <SkillDevelopmentMark checked={skill.checked} />

      <div className="min-w-0 flex-1">
        <span
          className="block truncate font-body text-sm leading-4 text-[var(--ml-ink-primary)]"
          data-testid="character-skill-name"
        >
          {skill.name}
        </span>
        {skill.specialty ? (
          <span
            className="block truncate font-body text-[0.68rem] leading-4 text-[var(--ml-accent-brass-strong)]"
            title={skill.specialty.description || skill.specialty.name}
          >
            {skill.specialty.name}
          </span>
        ) : null}
      </div>

      <span
        className="shrink-0 font-body text-[0.62rem] uppercase tracking-[0.08em] text-[var(--ml-ink-muted)]"
        data-testid="character-skill-base-value"
      >
        <span className="sr-only">Базовое значение: </span>
        <span aria-hidden="true">база </span>
        {skill.base_value}%
      </span>
      <span
        className="grid min-w-11 shrink-0 place-items-center rounded-sm border border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel-raised)]/70 px-1.5 py-1 font-mono text-base font-semibold tabular-nums text-[var(--ml-ink-primary)]"
        data-testid="character-skill-value"
      >
        <span className="sr-only">Значение навыка: </span>
        {skill.value}%
      </span>
    </li>
  )
}

export function CharacterSkills({ skills }: CharacterSkillsProps) {
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
