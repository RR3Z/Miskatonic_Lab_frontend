import { minMarqueeRepeatCount } from "@/components/marquee/infinite-marquee/constants/infinite-marquee.constants"
import type { MarqueeItem } from "@/components/marquee/infinite-marquee/types/infinite-marquee.types"

export function getMarqueeGroupCount(repeatCount: number | undefined): number {
  return Math.max(minMarqueeRepeatCount, repeatCount ?? minMarqueeRepeatCount)
}

export function getMarqueeGroupIds(groupCount: number): string[] {
  return Array.from({ length: groupCount }, (_, index) => `group-${index}`)
}

export function getMarqueeItemsWithIds(
  idPrefix: string,
  items: readonly string[],
): MarqueeItem[] {
  return items.map((item, index) => ({
    id: `${idPrefix}-item-${index}`,
    value: item,
  }))
}

export function isFirstMarqueeGroup(groupId: string): boolean {
  return groupId === "group-0"
}
