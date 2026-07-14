import type { LucideIcon } from "lucide-react"
import { Plus } from "lucide-react"
import type { StaticImageData } from "next/image"

import luckIcon from "../../../assets/icons/luck.svg"
import sanityIcon from "../../../assets/icons/sanity.svg"
import magicIcon from "../../../assets/symbols/black/sigil-angular-eye.svg"

export type CharacterStatVisualKey = "health" | "sanity" | "magic" | "luck"

type CharacterStatVisual = {
  icon?: LucideIcon
  iconClassName?: string
  image?: StaticImageData
  imageFilter?: string
}

export const characterStatVisuals: Record<
  CharacterStatVisualKey,
  CharacterStatVisual
> = {
  health: {
    icon: Plus,
    iconClassName: "text-[#b51f2e] [stroke-width:4]",
  },
  luck: {
    image: luckIcon,
    imageFilter:
      "brightness(0) saturate(100%) invert(40%) sepia(31%) saturate(1176%) hue-rotate(72deg) brightness(91%) contrast(86%)",
  },
  magic: {
    image: magicIcon,
    imageFilter:
      "brightness(0) saturate(100%) invert(52%) sepia(92%) saturate(1538%) hue-rotate(165deg) brightness(96%) contrast(101%)",
  },
  sanity: {
    image: sanityIcon,
    imageFilter:
      "brightness(0) saturate(100%) invert(27%) sepia(58%) saturate(1392%) hue-rotate(208deg) brightness(85%) contrast(93%)",
  },
}
