import type { ResourceStatDefinition } from "@/components/character/detail/header/character-stat-types"

export const CHARACTER_RESOURCE_TONE_CLASSES: Record<
  ResourceStatDefinition["tone"],
  string
> = {
  danger: "border-[#7f2930] text-[#d46a72]",
  luck: "border-[#557343] text-[#8fba70]",
  magic: "border-[#286b78] text-[#61b7c7]",
  sanity: "border-[#3d4f8b] text-[#7f91d6]",
}
