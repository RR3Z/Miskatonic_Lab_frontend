import Image from "next/image"

import { characterStatVisuals } from "@/components/character/character-stat-visuals"
import { CHARACTER_RESOURCE_TONE_CLASSES } from "@/components/character/detail/header/character-resource-tone-classes"
import type { ResourceStatDefinition } from "@/components/character/detail/header/character-stat-types"
import { cn } from "@/lib/utils/cn.util"

export function ResourceStat({
  current,
  label,
  max,
  tone,
  visualKey,
}: ResourceStatDefinition) {
  const visual = characterStatVisuals[visualKey]
  const Icon = visual.icon

  return (
    <div
      className={cn(
        "relative flex min-h-13 min-w-0 flex-col items-center justify-center overflow-hidden rounded-md border bg-[var(--ml-surface-panel-raised)]/75 px-2 py-1 text-center",
        CHARACTER_RESOURCE_TONE_CLASSES[tone],
      )}
      data-testid="character-resource"
    >
      {visual.image ? (
        <Image
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute size-10 opacity-[0.16]"
          data-testid="character-resource-icon"
          height={40}
          src={visual.image}
          style={
            visual.imageFilter ? { filter: visual.imageFilter } : undefined
          }
          width={40}
        />
      ) : Icon ? (
        <Icon
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute size-10 opacity-[0.16]",
            visual.iconClassName,
          )}
          data-testid="character-resource-icon"
        />
      ) : null}
      <span className="relative z-10 block font-body text-[0.6rem] uppercase tracking-[0.12em] text-[var(--ml-ink-muted)]">
        {label}
      </span>
      <span className="relative z-10 block font-mono text-base font-semibold tabular-nums">
        {current}/{max}
      </span>
    </div>
  )
}
