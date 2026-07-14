"use client"

import { DeleteResourceButton } from "@/components/character/detail/editors/delete-resource-button"
import { SkillDevelopmentMark } from "@/components/character/detail/skills/skill-development-mark"
import { useDeleteCharacterSkill } from "@/lib/api/use-character-skills"
import type { CharacterSkill } from "@/types/character"

export function CharacterSkillRow({
  characterId,
  skill,
}: {
  characterId: string
  skill: CharacterSkill
}) {
  const deleteMutation = useDeleteCharacterSkill(characterId)

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
      <DeleteResourceButton
        ariaLabel={`Удалить навык ${skill.name}`}
        className="size-7 opacity-60 hover:opacity-100"
        description={`Навык «${skill.name}» будет удалён у персонажа.`}
        errorMessage="Не удалось удалить навык. Возможно, он используется в имуществе."
        onDelete={() => deleteMutation.mutateAsync(skill.id)}
        title="Удалить навык?"
      />
    </li>
  )
}
