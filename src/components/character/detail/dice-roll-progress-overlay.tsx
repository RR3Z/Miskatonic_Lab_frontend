import { Spinner } from "@/components/ui/spinner"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"

export function DiceRollProgressOverlay() {
  return (
    <span
      className="pointer-events-none absolute inset-0 z-10 grid place-items-center bg-black/25"
      data-testid="dice-roll-progress"
    >
      <Spinner
        aria-label={
          localizedContent.copy.componentsCharacterDetailDiceRollProgressOverlay
            .vypolnyaetsyaBrosok
        }
        className="size-5 text-[var(--ml-accent-brass-strong)]"
      />
    </span>
  )
}
