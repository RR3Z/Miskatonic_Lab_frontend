import { Skeleton } from "@/components/ui/skeleton"

export function CharacterDetailLoading() {
  return (
    <div className="mx-auto w-full min-w-[1180px] max-w-[1720px] px-8 py-6">
      <output className="sr-only" aria-live="polite">
        Загрузка листа персонажа…
      </output>
      <Skeleton className="h-8 w-52" />
      <Skeleton className="mt-3 h-32 w-full border border-[var(--ml-border-subtle)]" />
      <div className="mt-4 grid h-[620px] grid-cols-[42fr_58fr] gap-1">
        <Skeleton className="border border-[var(--ml-border-subtle)]" />
        <Skeleton className="border border-[var(--ml-border-subtle)]" />
      </div>
    </div>
  )
}
