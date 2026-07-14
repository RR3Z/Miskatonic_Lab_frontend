import { Skeleton } from "@/components/ui/skeleton"

export function CharacterDetailLoading() {
  return (
    <div className="mx-auto w-full max-w-[1720px] px-8 py-10">
      <output className="sr-only" aria-live="polite">
        Загрузка листа персонажа…
      </output>
      <Skeleton className="h-10 w-72" />
      <Skeleton className="mt-5 h-40 w-full border border-[var(--ml-border-subtle)]" />
    </div>
  )
}
