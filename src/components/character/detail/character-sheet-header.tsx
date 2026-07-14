"use client"

import { Info } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

import {
  type CharacterStatVisualKey,
  characterStatVisuals,
} from "@/components/character/character-stat-visuals"
import {
  type CharacterStateRule,
  characterStateRules,
} from "@/components/character/detail/character-state-rules"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils/cn.util"
import { getPortraitKind, getPortraitUrl } from "@/lib/utils/portrait.util"
import type { CharacterDetail } from "@/types/character"

type CharacterSheetHeaderProps = {
  character: CharacterDetail
}

type ResourceStatProps = {
  current: number
  label: string
  max: number
  tone: "danger" | "magic" | "sanity" | "luck"
  visualKey: CharacterStatVisualKey
}

type CompactStatProps = {
  label: string
  title?: string
  value: number | string | null
}

type CharacterStateProps = {
  active: boolean
  onToggle: () => void
  rule: CharacterStateRule
  testId: string
  tone?: "danger" | "sanity" | "warning"
}

type CharacterStateValues = {
  dead: boolean
  dying: boolean
  indefiniteInsanity: boolean
  majorWound: boolean
  temporaryInsanity: boolean
  unconscious: boolean
}

const toneClasses = {
  danger: "border-[#7f2930] text-[#d46a72]",
  luck: "border-[#557343] text-[#8fba70]",
  magic: "border-[#286b78] text-[#61b7c7]",
  sanity: "border-[#3d4f8b] text-[#7f91d6]",
} as const

function ResourceStat({
  current,
  label,
  max,
  tone,
  visualKey,
}: ResourceStatProps) {
  const visual = characterStatVisuals[visualKey]
  const Icon = visual.icon

  return (
    <div
      className={cn(
        "relative flex min-h-13 min-w-0 flex-col items-center justify-center overflow-hidden rounded-md border bg-[var(--ml-surface-panel-raised)]/75 px-2 py-1 text-center",
        toneClasses[tone],
      )}
      data-testid="character-resource"
    >
      {visual.image ? (
        <Image
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute size-10 opacity-[0.16]"
          data-testid="character-resource-icon"
          height={40}
          src={visual.image}
          style={
            visual.imageFilter ? { filter: visual.imageFilter } : undefined
          }
          width={40}
        />
      ) : Icon ? (
        <Icon
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute size-10 opacity-[0.16]",
            visual.iconClassName,
          )}
          data-testid="character-resource-icon"
        />
      ) : null}
      <span className="relative z-10 block font-body text-[0.6rem] uppercase tracking-[0.12em] text-[var(--ml-ink-muted)]">
        {label}
      </span>
      <span className="relative z-10 block font-mono text-base font-semibold tabular-nums">
        {current}/{max}
      </span>
    </div>
  )
}

function CompactStat({ label, title, value }: CompactStatProps) {
  return (
    <div
      className="flex min-h-0 min-w-0 flex-col items-center justify-center rounded-sm border border-[var(--ml-border-subtle)] bg-[var(--ml-bg-page)]/25 px-2 py-1 text-center"
      title={title}
    >
      <span className="block truncate font-body text-[0.65rem] uppercase tracking-[0.12em] text-[var(--ml-ink-muted)]">
        {label}
      </span>
      <span className="block font-mono text-base font-semibold tabular-nums text-[var(--ml-ink-primary)]">
        {value ?? "—"}
      </span>
    </div>
  )
}

function CharacterState({
  active,
  onToggle,
  rule,
  testId,
  tone = "warning",
}: CharacterStateProps) {
  const activeClass = {
    danger:
      "border-[var(--ml-accent-danger)] bg-[var(--ml-accent-danger)]/20 text-[#d46a72]",
    sanity: "border-[#3d4f8b] bg-[#3d4f8b]/20 text-[#7f91d6]",
    warning:
      "border-[var(--ml-accent-warning)] bg-[var(--ml-accent-warning)]/15 text-[var(--ml-accent-warning)]",
  }[tone]

  return (
    <div
      className={cn(
        "flex min-h-7 min-w-0 items-center gap-1 rounded-sm border font-body text-[0.68rem] leading-tight uppercase tracking-normal",
        active
          ? activeClass
          : "border-[var(--ml-border-subtle)] text-[var(--ml-ink-muted)] opacity-60",
      )}
      data-active={active}
      data-testid={testId}
    >
      <button
        aria-pressed={active}
        className="flex min-w-0 flex-1 self-stretch cursor-pointer items-center px-2 py-1 text-left transition-colors hover:bg-[var(--ml-surface-panel-raised)]/45 focus-visible:outline-1 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--ml-focus-ring)]"
        onClick={onToggle}
        type="button"
      >
        <span className="min-w-0 flex-1 whitespace-normal" title={rule.label}>
          {rule.label}
        </span>
      </button>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            aria-label={`Информация о состоянии: ${rule.label}`}
            className="mr-1 grid size-5 shrink-0 place-items-center rounded-sm text-current opacity-75 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-[var(--ml-focus-ring)]"
            type="button"
          >
            <Info aria-hidden="true" className="size-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent
          className="flex max-w-90 flex-col items-start gap-2 border border-[#5d5231] bg-[#171411] p-3 text-left text-[#d9d2c5] shadow-[0_14px_40px_rgba(0,0,0,0.55)] [&>span>svg]:bg-[#171411] [&>span>svg]:fill-[#171411]"
          side="bottom"
          sideOffset={6}
        >
          <p className="font-heading text-base font-semibold">{rule.label}</p>
          <p>{rule.description}</p>
          <p>
            <strong>Как получить:</strong> {rule.acquisition}
          </p>
          <p>
            <strong>Последствие:</strong> {rule.consequence}
          </p>
          <p className="text-xs opacity-70">{rule.source}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

function CharacterStates({
  initialValues,
}: {
  initialValues: CharacterStateValues
}) {
  const [states, setStates] = useState(initialValues)
  const toggleState = (state: keyof CharacterStateValues) => {
    setStates((current) => ({ ...current, [state]: !current[state] }))
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="grid min-h-0 flex-1 grid-cols-[1.15fr_0.85fr] items-stretch gap-2">
        <div className="flex min-h-0 flex-col">
          <h3 className="mb-0.5 font-body text-[0.64rem] uppercase tracking-[0.12em] text-[var(--ml-ink-muted)]">
            Здоровье
          </h3>
          <div className="grid min-h-0 flex-1 auto-rows-fr grid-cols-2 gap-1.5">
            <CharacterState
              active={states.majorWound}
              onToggle={() => toggleState("majorWound")}
              rule={characterStateRules.majorWound}
              testId="character-state-major-wound"
            />
            <CharacterState
              active={states.unconscious}
              onToggle={() => toggleState("unconscious")}
              rule={characterStateRules.unconscious}
              testId="character-state-unconscious"
            />
            <CharacterState
              active={states.dying}
              onToggle={() => toggleState("dying")}
              rule={characterStateRules.dying}
              testId="character-state-dying"
              tone="danger"
            />
            <CharacterState
              active={states.dead}
              onToggle={() => toggleState("dead")}
              rule={characterStateRules.dead}
              testId="character-state-dead"
              tone="danger"
            />
          </div>
        </div>
        <div className="flex min-h-0 flex-col">
          <h3 className="mb-0.5 font-body text-[0.64rem] uppercase tracking-[0.12em] text-[var(--ml-ink-muted)]">
            Рассудок
          </h3>
          <div className="grid min-h-0 flex-1 auto-rows-fr grid-cols-1 gap-1.5">
            <CharacterState
              active={states.temporaryInsanity}
              onToggle={() => toggleState("temporaryInsanity")}
              rule={characterStateRules.temporaryInsanity}
              testId="character-state-temporary-insanity"
              tone="sanity"
            />
            <CharacterState
              active={states.indefiniteInsanity}
              onToggle={() => toggleState("indefiniteInsanity")}
              rule={characterStateRules.indefiniteInsanity}
              testId="character-state-indefinite-insanity"
              tone="sanity"
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-1.5 font-body text-xs uppercase tracking-[0.16em] text-[var(--ml-accent-brass-strong)]">
      {children}
    </h2>
  )
}

function IdentityLine({
  label,
  testId,
  value,
}: {
  label: string
  testId?: string
  value: number | string | null
}) {
  return (
    <p
      className="truncate font-body text-sm leading-5 text-[var(--ml-ink-primary)]"
      data-testid={testId}
    >
      <span className="text-[var(--ml-ink-muted)]">{label}:</span>{" "}
      {value ?? "—"}
    </p>
  )
}

export function CharacterSheetHeader({ character }: CharacterSheetHeaderProps) {
  const portraitKind = getPortraitKind(character.sex)
  const portraitSrc = getPortraitUrl(character.portrait_url, character.sex)
  const sexLabel = character.sex
    ? portraitKind === "female"
      ? "Женщина"
      : "Мужчина"
    : null

  const characteristics = [
    ["СИЛ", "Сила", character.characteristics.strength],
    ["ВЫН", "Выносливость", character.characteristics.constitution],
    ["ТЕЛ", "Телосложение", character.characteristics.size],
    ["ЛВК", "Ловкость", character.characteristics.dexterity],
    ["НАР", "Наружность", character.characteristics.appearance],
    ["ИНТ", "Интеллект", character.characteristics.intelligence],
    ["МОЩ", "Мощь", character.characteristics.power],
    ["ОБР", "Образование", character.characteristics.education],
  ] as const

  const derivedStats = [
    ["Скорость", character.derived_stats.speed],
    ["Комплекция", character.derived_stats.physique],
    ["Бонус урона", character.derived_stats.damage_bonus],
    ["Уклонение", character.derived_stats.dodge_value],
  ] as const

  const resources = [
    {
      current: character.hp.current_hp,
      label: "Здоровье",
      max: character.hp.max_hp,
      tone: "danger",
      visualKey: "health",
    },
    {
      current: character.sanity.current_sanity,
      label: "Рассудок",
      max: character.sanity.max_sanity,
      tone: "sanity",
      visualKey: "sanity",
    },
    {
      current: character.mp.current_mp,
      label: "Магия",
      max: character.mp.max_mp,
      tone: "magic",
      visualKey: "magic",
    },
    {
      current: character.luck.current_luck,
      label: "Удача",
      max: character.luck.starting_luck,
      tone: "luck",
      visualKey: "luck",
    },
  ] as const

  return (
    <header
      className="relative grid shrink-0 grid-cols-[minmax(360px,1fr)_1px_minmax(260px,0.95fr)_1px_minmax(150px,0.55fr)_1px_minmax(490px,1.4fr)] items-stretch gap-2 overflow-hidden rounded-md border border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel)] p-2 shadow-[0_18px_45px_rgba(0,0,0,0.18)]"
      data-testid="character-sheet-header"
    >
      <section className="flex h-full min-w-0 self-stretch items-center gap-3">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-sm border border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel-raised)]">
          <Image
            alt={`${portraitKind === "female" ? "Женский" : "Мужской"} портрет ${character.name}`}
            className="object-cover"
            fill
            sizes="96px"
            src={portraitSrc}
            unoptimized={Boolean(character.portrait_url)}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-heading text-3xl font-semibold tracking-wide text-[var(--ml-ink-primary)]">
            {character.name}
          </h1>
          <div className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-0.5">
            <IdentityLine
              label="Профессия"
              testId="character-occupation"
              value={character.occupation}
            />
            <IdentityLine
              label="Возраст"
              testId="character-age"
              value={character.age}
            />
            <IdentityLine label="Игрок" value={character.player_name} />
            <IdentityLine label="Пол" testId="character-sex" value={sexLabel} />
            <div className="col-span-2">
              <IdentityLine
                label="Место жительства"
                value={character.residence}
              />
            </div>
            <div className="col-span-2">
              <IdentityLine
                label="Место рождения"
                value={character.birthplace}
              />
            </div>
          </div>
        </div>
      </section>

      <Separator
        className="my-1 bg-[var(--ml-border-subtle)]"
        orientation="vertical"
      />

      <section className="flex h-full min-w-0 self-stretch flex-col py-1">
        <SectionTitle>Характеристики</SectionTitle>
        <div className="grid min-h-0 flex-1 auto-rows-fr grid-cols-4 gap-1.5">
          {characteristics.map(([label, title, value]) => (
            <CompactStat
              key={label}
              label={label}
              title={title}
              value={value}
            />
          ))}
        </div>
      </section>

      <Separator
        className="my-1 bg-[var(--ml-border-subtle)]"
        orientation="vertical"
      />

      <section className="flex h-full min-w-0 self-stretch flex-col py-1">
        <SectionTitle>Производные</SectionTitle>
        <div className="grid min-h-0 flex-1 auto-rows-fr grid-cols-2 gap-1.5">
          {derivedStats.map(([label, value]) => (
            <CompactStat key={label} label={label} value={value} />
          ))}
        </div>
      </section>

      <Separator
        className="my-1 bg-[var(--ml-border-subtle)]"
        orientation="vertical"
      />

      <div className="grid h-full min-w-0 self-stretch grid-cols-[minmax(175px,0.7fr)_1px_minmax(300px,1.3fr)] items-stretch gap-2">
        <section className="flex h-full min-w-0 self-stretch flex-col py-1">
          <SectionTitle>Ресурсы</SectionTitle>
          <div
            className="grid min-h-0 flex-1 auto-rows-fr grid-cols-2 gap-1.5"
            data-testid="character-resource-grid"
          >
            {resources.map((resource) => (
              <ResourceStat key={resource.visualKey} {...resource} />
            ))}
          </div>
        </section>

        <Separator
          className="my-1 bg-[var(--ml-border-subtle)]"
          orientation="vertical"
        />

        <section className="flex h-full min-w-0 self-stretch flex-col py-1">
          <SectionTitle>Состояния</SectionTitle>
          <CharacterStates
            initialValues={{
              dead: character.hp.dead,
              dying: character.hp.dying,
              indefiniteInsanity: character.sanity.indef_insanity,
              majorWound: character.hp.major_wound,
              temporaryInsanity: character.sanity.temp_insanity,
              unconscious: character.hp.unconscious,
            }}
            key={character.id}
          />
        </section>
      </div>
    </header>
  )
}
