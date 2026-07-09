import type { StaticImageData } from "next/image"
import type { PortraitKind } from "@/types/character"
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
    value === "женщина" ||
    value === "жен" ||
    value === "ж"
    ? "female"
    : "male"
}

function imageSrc(image: StaticImageData | string): string {
  return typeof image === "string" ? image : image.src
}
