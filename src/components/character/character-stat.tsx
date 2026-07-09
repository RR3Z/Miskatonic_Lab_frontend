import type { LucideIcon } from "lucide-react"
import type { StaticImageData } from "next/image"
import Image from "next/image"

type CharacterStatProps = {
  icon?: LucideIcon
  image?: StaticImageData
  current: number
  max: number
  label: string
}

export function CharacterStat({
  icon,
  image,
  current,
  max,
  label,
}: CharacterStatProps) {
  const Icon = icon

  return (
    <div className="flex items-center gap-1.5" title={label}>
      {image ? (
        <Image
          alt=""
          aria-hidden="true"
          className="size-4 opacity-70"
          height={16}
          src={image}
          width={16}
        />
      ) : Icon ? (
        <Icon aria-hidden="true" className="size-4 opacity-70" />
      ) : null}
      <span className="font-body text-xs text-[var(--ml-ink-muted)] tabular-nums">
        {current}/{max}
      </span>
    </div>
  )
}
