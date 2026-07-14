import Image from "next/image"
import Link from "next/link"

import { CharacterCardActions } from "@/components/character/character-card-actions"
import { CharacterStat } from "@/components/character/character-stat"
import { characterStatVisuals } from "@/components/character/character-stat-visuals"
import { Card } from "@/components/ui/card"
import { appRoutes } from "@/lib/routes/app-routes"
import { getPortraitKind, getPortraitUrl } from "@/lib/utils/portrait.util"
import type { CharacterListItem } from "@/types/character"
import cardTentacle from "../../../assets/character-card-tentacle.svg"

type CharacterCardProps = {
  character: CharacterListItem
  onDelete: (characterId: string) => Promise<void>
}

const cardTentacleUrl =
  typeof cardTentacle === "string" ? cardTentacle : cardTentacle.src

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
    <Card
      asChild
      className="relative h-[120px] flex-row gap-0 rounded-md border border-[var(--ml-border-subtle)] bg-[var(--ml-surface-panel)] p-[6px] py-[6px] ring-0 transition-colors hover:border-[var(--ml-border-aged)]"
      size="sm"
    >
      <article className="group">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full bg-cover opacity-[0.09]"
          data-testid="character-card-tentacle"
          style={{ backgroundImage: `url(${cardTentacleUrl})` }}
        />
        <div className="relative my-auto size-[92px] shrink-0 overflow-hidden rounded-sm border border-[var(--ml-border-subtle)] bg-[var(--ml-surface-panel-raised)]">
          <Image
            alt={`${portraitKind === "female" ? "Женский" : "Мужской"} портрет`}
            className="object-cover"
            fill
            sizes="92px"
            src={portraitSrc}
            unoptimized={Boolean(character.portrait_url)}
          />
        </div>
        <div className="relative ml-[6px] flex min-w-0 flex-1 flex-col py-0.5">
          <div className="flex min-w-0 items-start gap-1">
            <h3 className="min-w-0 flex-1 truncate font-heading text-xl font-medium leading-tight text-[var(--ml-ink-primary)]">
              <Link
                className="after:absolute after:inset-0 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ml-focus-ring)]"
                href={appRoutes.character(character.id)}
              >
                {character.name}
              </Link>
            </h3>
            <CharacterCardActions character={character} onDelete={onDelete} />
          </div>
          <p className="mt-0.5 truncate font-body text-base text-[var(--ml-ink-muted)]">
            {subtitle || "Данные сыщика не заполнены"}
          </p>
          <div
            data-testid="character-stats"
            className="mt-auto grid grid-cols-4 items-center gap-1"
          >
            <CharacterStat
              current={character.hp.current}
              label="Здоровье"
              max={character.hp.max}
              {...characterStatVisuals.health}
            />
            <CharacterStat
              current={character.sanity.current}
              label="Рассудок"
              max={character.sanity.max}
              {...characterStatVisuals.sanity}
            />
            <CharacterStat
              current={character.mp.current}
              label="Магия"
              max={character.mp.max}
              {...characterStatVisuals.magic}
            />
            <CharacterStat
              current={character.luck.current}
              label="Удача"
              max={character.luck.starting}
              {...characterStatVisuals.luck}
            />
          </div>
        </div>
      </article>
    </Card>
  )
}
