import { HeartPulse, MoreHorizontal, Sparkles } from "lucide-react"
import Image from "next/image"

import { CharacterStat } from "@/components/character/character-stat"
import { getPortraitKind, getPortraitUrl } from "@/lib/utils/portrait.util"
import type { CharacterListItem } from "@/types/character"
import luckIcon from "../../../assets/icons/luck.svg"
import sanityIcon from "../../../assets/icons/sanity.svg"

type CharacterCardProps = {
  character: CharacterListItem
}

export function CharacterCard({ character }: CharacterCardProps) {
  const portraitSrc = getPortraitUrl(character.portrait_url, character.sex)
  const portraitKind = getPortraitKind(character.sex)
  const subtitle = [
    character.sex,
    character.age !== null ? `${character.age} лет` : null,
    character.occupation,
    character.residence,
  ]
    .filter(Boolean)
    .join(", ")

  return (
    <article className="group/card flex min-h-40 flex-col gap-3 rounded-lg border border-[var(--ml-border-subtle)] bg-[var(--ml-surface-panel)]/82 p-3 transition hover:border-[var(--ml-border-aged)]">
      <div className="flex items-start gap-3">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-[var(--ml-surface-panel-raised)]">
          <Image
            alt={`${portraitKind === "female" ? "Женский" : "Мужской"} портрет`}
            className="object-cover"
            fill
            sizes="80px"
            src={portraitSrc}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-start gap-2">
            <h3 className="min-w-0 flex-1 truncate font-heading text-lg font-semibold leading-tight text-[var(--ml-ink-primary)]">
              {character.name}
            </h3>
            <button
              aria-label="Действия персонажа"
              className="size-6 shrink-0 cursor-not-allowed rounded text-[var(--ml-ink-muted)] opacity-65"
              disabled
              type="button"
            >
              <MoreHorizontal aria-hidden="true" className="size-5" />
            </button>
          </div>
          <p className="mt-0.5 truncate font-body text-xs text-[var(--ml-ink-muted)]">
            {subtitle || "Данные сыщика не заполнены"}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <CharacterStat
          current={character.hp.current}
          icon={HeartPulse}
          label="Здоровье"
          max={character.hp.max}
        />
        <CharacterStat
          current={character.mp.current}
          icon={Sparkles}
          label="Магия"
          max={character.mp.max}
        />
        <CharacterStat
          current={character.sanity.current}
          image={sanityIcon}
          label="Рассудок"
          max={character.sanity.max}
        />
        <CharacterStat
          current={character.luck.current}
          image={luckIcon}
          label="Удача"
          max={character.luck.starting}
        />
      </div>
    </article>
  )
}
