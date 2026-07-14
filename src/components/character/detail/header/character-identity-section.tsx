import Image from "next/image"

import { IdentityLine } from "@/components/character/detail/header/identity-line"
import { getPortraitKind, getPortraitUrl } from "@/lib/utils/portrait.util"
import type { CharacterDetail } from "@/types/character"

type CharacterIdentitySectionProps = {
  character: CharacterDetail
}

export function CharacterIdentitySection({
  character,
}: CharacterIdentitySectionProps) {
  const portraitKind = getPortraitKind(character.sex)
  const portraitSrc = getPortraitUrl(character.portrait_url, character.sex)
  const sexLabel = character.sex
    ? portraitKind === "female"
      ? "Женщина"
      : "Мужчина"
    : null

  return (
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
          <IdentityLine label="Место жительства" value={character.residence} />
          <IdentityLine label="Пол" testId="character-sex" value={sexLabel} />
          <div className="col-span-2">
            <IdentityLine label="Место рождения" value={character.birthplace} />
          </div>
        </div>
      </div>
    </section>
  )
}
