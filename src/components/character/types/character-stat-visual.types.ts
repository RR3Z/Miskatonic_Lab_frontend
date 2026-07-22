import type { LucideIcon } from "lucide-react"
import type { StaticImageData } from "next/image"

export type CharacterStatVisualKey = "health" | "sanity" | "magic" | "luck"

export type CharacterStatVisual = {
  icon?: LucideIcon
  iconClassName?: string
  image?: StaticImageData
  imageFilter?: string
}
