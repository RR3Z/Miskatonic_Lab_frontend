import type { StaticImageData } from "next/image"
import localizedContent from "@/data/locales/ru/common/common.ru.json"
import type { PortraitKind } from "@/types/character.types"
import malePlaceholder from "../../../assets/characters/male-placeholder.webp"
import womenPlaceholder from "../../../assets/characters/women-placeholder.webp"

export function getPortraitUrl(
  portraitUrl: string | null,
  sex: string | null,
): string {
  if (portraitUrl) return portraitUrl

  const kind = getPortraitKind(sex)
  return imageSrc(kind === "female" ? womenPlaceholder : malePlaceholder)
}

export function getPortraitKind(sex: string | null): PortraitKind {
  const value = sex?.trim().toLowerCase()

  return value === "female" ||
    value === "woman" ||
    value === localizedContent.copy.libUtilsPortraitUtil.zhenschina ||
    value === localizedContent.copy.libUtilsPortraitUtil.zhen ||
    value === localizedContent.copy.libUtilsPortraitUtil.zh
    ? "female"
    : "male"
}

function imageSrc(image: StaticImageData | string): string {
  return typeof image === "string" ? image : image.src
}
