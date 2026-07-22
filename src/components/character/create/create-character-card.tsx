import { UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card/card"
import localizedContent from "@/data/locales/ru/character/create.ru.json"
import cardTentacle from "../../../../assets/character-card-tentacle.svg"

const cardClassName =
  "relative h-[120px] w-full gap-0 rounded-md border border-[var(--ml-border-subtle)] bg-[var(--ml-surface-panel)] p-0 py-0 ring-0 transition hover:border-[var(--ml-border-aged)] hover:bg-[var(--ml-surface-panel-raised)]"
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
        aria-label={
          localizedContent.copy.componentsCharacterCreateCreateCharacterCard
            .sozdatNovogoSyschika
        }
        className="relative h-full w-full gap-2 rounded-md font-heading text-lg text-[var(--ml-ink-primary)]"
        onClick={onCreate}
        type="button"
        variant="ghost"
      >
        <UserPlus className="size-6 shrink-0" />
        <span>
          {
            localizedContent.copy.componentsCharacterCreateCreateCharacterCard
              .sozdatNovogoSyschika
          }
        </span>
      </Button>
    </Card>
  )
}
