import type { LucideIcon } from "lucide-react"
import type { StaticImageData } from "next/image"
import Image from "next/image"

import { cn } from "@/lib/utils/cn.util"

type CharacterStatProps = {
  icon?: LucideIcon
  image?: StaticImageData
  iconClassName?: string
  imageClassName?: string
  imageFilter?: string
  current: number
  max: number
  label: string
}

export function CharacterStat({
  icon,
  image,
  iconClassName,
  imageClassName,
  imageFilter,
  current,
  max,
  label,
}: CharacterStatProps) {
  const Icon = icon

  return (
    <div className="flex min-w-0 items-center gap-1" title={label}>
      {image ? (
        <Image
          alt=""
          aria-hidden="true"
          className={cn("size-6 shrink-0", imageClassName)}
          height={24}
          src={image}
          style={imageFilter ? { filter: imageFilter } : undefined}
          width={24}
        />
      ) : Icon ? (
        <Icon
          aria-hidden="true"
          className={cn("size-6 shrink-0", iconClassName)}
        />
      ) : null}
      <span className="whitespace-nowrap font-body text-base text-[var(--ml-ink-primary)] tabular-nums">
        {current}/{max}
      </span>
    </div>
  )
}
