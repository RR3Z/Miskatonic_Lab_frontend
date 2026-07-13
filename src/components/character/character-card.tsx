import { Brain, Plus } from "lucide-react"
import Image from "next/image"

import { CharacterCardActions } from "@/components/character/character-card-actions"
import { CharacterStat } from "@/components/character/character-stat"
import { getPortraitKind, getPortraitUrl } from "@/lib/utils/portrait.util"
import type { CharacterListItem } from "@/types/character"
import cardTentacle from "../../../assets/character-card-tentacle.svg"
import luckIcon from "../../../assets/icons/luck.svg"
import magicIcon from "../../../assets/symbols/black/sigil-angular-eye.svg"

type CharacterCardProps = {
  character: CharacterListItem
  onDelete: (characterId: string) => Promise<void>
}

const magicIconFilter =
  "brightness(0) saturate(100%) invert(52%) sepia(92%) saturate(1538%) hue-rotate(165deg) brightness(96%) contrast(101%)"
const luckIconFilter =
  "brightness(0) saturate(100%) invert(40%) sepia(31%) saturate(1176%) hue-rotate(72deg) brightness(91%) contrast(86%)"

export function CharacterCard({ character, onDelete }: CharacterCardProps) {
  const portraitSrc = getPortraitUrl(character.portrait_url, character.sex)
  const portraitKind = getPortraitKind(character.sex)
  const sexLabel = character.sex
    ? portraitKind === "female"
      ? "Женщина"
      : "Мужчина"
    : null
  const subtitle = [
    sexLabel,
    character.age !== null ? `${character.age} лет` : null,
    character.residence,
  ]
    .filter(Boolean)
    .join(", ")

  return (
    <article className="group/card relative flex h-[104px] overflow-hidden rounded-md border border-[var(--ml-border-subtle)] bg-[var(--ml-surface-panel)] p-[6px] transition-colors hover:border-[var(--ml-border-aged)]">
      <Image
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.09]"
        fill
        sizes="(min-width: 1536px) 25vw, (min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
        src={cardTentacle}
      />
      <div className="relative my-auto size-20 shrink-0 overflow-hidden rounded-sm border border-[var(--ml-border-subtle)] bg-[var(--ml-surface-panel-raised)]">
        <Image
          alt={`${portraitKind === "female" ? "Женский" : "Мужской"} портрет`}
          className="object-cover"
          fill
          sizes="80px"
          src={portraitSrc}
        />
      </div>
      <div className="relative ml-[6px] flex min-w-0 flex-1 flex-col py-0.5">
        <div className="flex min-w-0 items-start gap-1">
          <h3 className="min-w-0 flex-1 truncate font-heading text-[1.05rem] font-medium leading-tight text-[var(--ml-ink-primary)]">
            {character.name}
          </h3>
          <CharacterCardActions character={character} onDelete={onDelete} />
        </div>
        <p className="mt-0.5 truncate font-body text-xs text-[var(--ml-ink-muted)]">
          {subtitle || "Данные сыщика не заполнены"}
        </p>
        <div
          data-testid="character-stats"
          className="mt-auto grid grid-cols-4 items-center gap-1"
        >
          <CharacterStat
            current={character.hp.current}
            icon={Plus}
            iconClassName="text-[#b51f2e] [stroke-width:4]"
            label="Здоровье"
            max={character.hp.max}
          />
          <CharacterStat
            current={character.mp.current}
            image={magicIcon}
            imageFilter={magicIconFilter}
            label="Магия"
            max={character.mp.max}
          />
          <CharacterStat
            current={character.sanity.current}
            icon={Brain}
            iconClassName="text-[#3547a5]"
            label="Рассудок"
            max={character.sanity.max}
          />
          <CharacterStat
            current={character.luck.current}
            image={luckIcon}
            imageFilter={luckIconFilter}
            label="Удача"
            max={character.luck.starting}
          />
        </div>
      </div>
    </article>
  )
}
