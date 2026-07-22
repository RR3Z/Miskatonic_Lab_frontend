import Image from "next/image"

import type { characterStatVisuals } from "@/components/character/constants/character-stat-visuals.constants"
import { cn } from "@/lib/utils/cn.util"

type ResourceDialogBackgroundProps = {
  visual: (typeof characterStatVisuals)[keyof typeof characterStatVisuals]
}

export function ResourceDialogBackground({
  visual,
}: ResourceDialogBackgroundProps) {
  const Icon = visual.icon
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 grid place-items-center opacity-[0.12]"
      data-testid="resource-dialog-icon"
    >
      {visual.image ? (
        <Image
          alt=""
          className="size-48"
          height={192}
          src={visual.image}
          style={
            visual.imageFilter ? { filter: visual.imageFilter } : undefined
          }
          width={192}
        />
      ) : Icon ? (
        <Icon className={cn("size-48", visual.iconClassName)} />
      ) : null}
    </div>
  )
}
