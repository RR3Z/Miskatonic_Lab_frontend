import { Skeleton } from "@/components/ui/skeleton"
import localizedContent from "@/data/locales/ru/character/list.ru.json"

const skeletonCards = [
  "skeleton-card-1",
  "skeleton-card-2",
  "skeleton-card-3",
  "skeleton-card-4",
  "skeleton-card-5",
  "skeleton-card-6",
]

export function CharacterListLoading() {
  return (
    <>
      <output className="sr-only" aria-live="polite">
        {
          localizedContent.copy.componentsCharacterListCharacterListLoading
            .zagruzkaPersonazhei
        }
      </output>
      {skeletonCards.map((key) => (
        <Skeleton
          aria-hidden="true"
          key={key}
          className="h-[120px] rounded-md border border-[var(--ml-border-subtle)] bg-[var(--ml-surface-panel)]/80"
        />
      ))}
    </>
  )
}
