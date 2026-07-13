import { UserPlus } from "lucide-react"
import Image from "next/image"

import cardTentacle from "../../../assets/character-card-tentacle.svg"

const cardClassName =
  "relative flex h-[104px] w-full items-center justify-center gap-2 overflow-hidden rounded-md border border-[var(--ml-border-subtle)] bg-[var(--ml-surface-panel)] p-4 transition"

type CreateCharacterCardProps = {
  atLimit?: boolean
}

export function CreateCharacterCard({
  atLimit = false,
}: CreateCharacterCardProps) {
  const label = atLimit ? "Достигнут лимит персонажей" : "Создать нового сыщика"

  return (
    <button
      aria-label={`${label} — скоро`}
      className={`${cardClassName} cursor-not-allowed disabled:opacity-75`}
      disabled
      type="button"
    >
      <Image
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.11]"
        fill
        sizes="(min-width: 1536px) 25vw, (min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
        src={cardTentacle}
      />
      <UserPlus className="relative size-6 shrink-0 text-[var(--ml-ink-primary)]" />
      <span className="relative font-heading text-lg text-[var(--ml-ink-primary)]">
        {label}
      </span>
    </button>
  )
}
