import type * as React from "react"
import { getMarqueeItemsWithIds } from "@/components/marquee/infinite-marquee/utils/infinite-marquee.util"
import { cn } from "@/lib/utils/cn.util"

type MarqueeGroupProps = {
  groupRef?: React.Ref<HTMLDivElement>
  idPrefix: string
  itemClassName?: string
  items: readonly string[]
  separator: React.ReactNode
}

export function MarqueeGroup({
  groupRef,
  idPrefix,
  itemClassName,
  items,
  separator,
}: MarqueeGroupProps) {
  const itemsWithIds = getMarqueeItemsWithIds(idPrefix, items)

  return (
    <div className="flex shrink-0 items-center" ref={groupRef}>
      {itemsWithIds.map((item) => (
        <div className="flex items-center pr-4" key={item.id}>
          <span className={cn("whitespace-nowrap", itemClassName)}>
            {item.value}
          </span>
          <span className="pl-4">{separator}</span>
        </div>
      ))}
    </div>
  )
}
