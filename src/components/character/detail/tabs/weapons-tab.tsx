import { Swords } from "lucide-react"

import { EmptySection } from "@/components/character/detail/tabs/empty-section"

export function WeaponsTab() {
  return (
    <EmptySection>
      <div className="flex max-w-sm flex-col items-center gap-3">
        <Swords
          aria-hidden="true"
          className="size-8 text-[var(--ml-accent-brass-strong)] opacity-70"
        />
        <p>Оружие и атаки пока не поддерживаются Backend-моделью персонажа.</p>
      </div>
    </EmptySection>
  )
}
