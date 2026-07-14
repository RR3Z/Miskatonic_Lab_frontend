import { Skeleton } from "@/components/ui/skeleton"

export function CharacterDetailLoading() {
  return (
    <div className="flex h-[100svh] w-full min-w-[1180px] flex-col px-4 py-4">
      <output className="sr-only" aria-live="polite">
        Загрузка листа персонажа…
      </output>
      <Skeleton className="h-40 w-full shrink-0 border border-[var(--ml-border-subtle)]" />
      <div className="mt-3 grid min-h-[620px] flex-1 grid-cols-[58fr_42fr] gap-1">
        <Skeleton className="border border-[var(--ml-border-subtle)]" />
        <Skeleton className="border border-[var(--ml-border-subtle)]" />
      </div>
    </div>
  )
}
