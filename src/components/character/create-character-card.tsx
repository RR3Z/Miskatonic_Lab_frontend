import { UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import cardTentacle from "../../../assets/character-card-tentacle.svg"

const cardClassName =
  "relative h-[104px] w-full gap-0 rounded-md border border-[var(--ml-border-subtle)] bg-[var(--ml-surface-panel)] p-0 py-0 ring-0 transition hover:border-[var(--ml-border-aged)] hover:bg-[var(--ml-surface-panel-raised)]"
const cardTentacleUrl =
  typeof cardTentacle === "string" ? cardTentacle : cardTentacle.src

type CreateCharacterCardProps = {
  onCreate: () => void
}

export function CreateCharacterCard({ onCreate }: CreateCharacterCardProps) {
  return (
    <Card className={cardClassName} size="sm">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full bg-cover opacity-[0.11]"
        data-testid="character-card-tentacle"
        style={{ backgroundImage: `url(${cardTentacleUrl})` }}
      />
      <Button
        aria-label="Создать нового сыщика"
        className="relative h-full w-full gap-2 rounded-md font-heading text-lg text-[var(--ml-ink-primary)]"
        onClick={onCreate}
        type="button"
        variant="ghost"
      >
        <UserPlus className="size-6 shrink-0" />
        <span>Создать нового сыщика</span>
      </Button>
    </Card>
  )
}
