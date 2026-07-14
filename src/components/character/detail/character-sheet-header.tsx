import Image from "next/image"

import { getPortraitKind, getPortraitUrl } from "@/lib/utils/portrait.util"
import type { CharacterDetail } from "@/types/character"

type CharacterSheetHeaderProps = {
  character: CharacterDetail
}

type HeaderStatProps = {
  current: number
  label: string
  max: number
  tone: "danger" | "magic" | "sanity" | "luck"
}

const toneClasses = {
  danger: "border-[#7f2930] text-[#d46a72]",
  luck: "border-[#557343] text-[#8fba70]",
  magic: "border-[#286b78] text-[#61b7c7]",
  sanity: "border-[#3d4f8b] text-[#7f91d6]",
} as const

function HeaderStat({ current, label, max, tone }: HeaderStatProps) {
  return (
    <div
      className={`min-w-24 rounded-md border bg-[var(--ml-surface-panel-raised)]/75 px-3 py-2 ${toneClasses[tone]}`}
    >
      <span className="block font-body text-[0.65rem] uppercase tracking-[0.16em] text-[var(--ml-ink-muted)]">
        {label}
      </span>
      <span className="mt-0.5 block font-mono text-lg font-semibold tabular-nums">
        {current}/{max}
      </span>
    </div>
  )
}

export function CharacterSheetHeader({ character }: CharacterSheetHeaderProps) {
  const portraitKind = getPortraitKind(character.sex)
  const portraitSrc = getPortraitUrl(character.portrait_url, character.sex)
  const identityDetails = [
    character.occupation,
    character.age !== null ? `${character.age} лет` : null,
    character.residence,
  ].filter(Boolean)

  return (
    <header
      className="relative flex min-h-32 items-stretch overflow-hidden rounded-md border border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel)] shadow-[0_18px_45px_rgba(0,0,0,0.18)]"
      data-testid="character-sheet-header"
    >
      <div className="relative m-3 aspect-square w-28 shrink-0 overflow-hidden rounded-sm border border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel-raised)]">
        <Image
          alt={`${portraitKind === "female" ? "Женский" : "Мужской"} портрет ${character.name}`}
          className="object-cover"
          fill
          sizes="112px"
          src={portraitSrc}
          unoptimized={Boolean(character.portrait_url)}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center border-l border-[var(--ml-border-subtle)] px-5 py-4">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-[var(--ml-accent-brass-strong)]">
          Лист сыщика
        </p>
        <h1 className="mt-1 truncate font-heading text-4xl font-semibold tracking-wide text-[var(--ml-ink-primary)]">
          {character.name}
        </h1>
        <p className="mt-1 truncate font-body text-base text-[var(--ml-ink-muted)]">
          {identityDetails.join(" · ") || "Основные сведения не заполнены"}
        </p>
        <div className="mt-3 flex items-center gap-4 text-sm text-[var(--ml-ink-muted)]">
          <span>Игрок: {character.player_name || "—"}</span>
          <span>Место рождения: {character.birthplace || "—"}</span>
        </div>
      </div>

      <div className="grid shrink-0 grid-cols-2 content-center gap-2 border-l border-[var(--ml-border-subtle)] bg-[var(--ml-bg-page)]/30 p-4">
        <HeaderStat
          current={character.hp.current_hp}
          label="Здоровье"
          max={character.hp.max_hp}
          tone="danger"
        />
        <HeaderStat
          current={character.sanity.current_sanity}
          label="Рассудок"
          max={character.sanity.max_sanity}
          tone="sanity"
        />
        <HeaderStat
          current={character.mp.current_mp}
          label="Магия"
          max={character.mp.max_mp}
          tone="magic"
        />
        <HeaderStat
          current={character.luck.current_luck}
          label="Удача"
          max={character.luck.starting_luck}
          tone="luck"
        />
      </div>
    </header>
  )
}
