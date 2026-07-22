"use client"

import {
  defaultMarqueeDurationSeconds,
  defaultMarqueeSeparator,
} from "@/components/marquee/infinite-marquee/constants/infinite-marquee.constants"
import { MarqueeTrack } from "@/components/marquee/infinite-marquee/marquee-track"
import type { InfiniteMarqueeProps } from "@/components/marquee/infinite-marquee/types/infinite-marquee.types"
import { getMarqueeGroupCount } from "@/components/marquee/infinite-marquee/utils/infinite-marquee.util"
import { useMarqueeLoopWidth } from "@/hooks/marquee/use-marquee-loop-width"
import { cn } from "@/lib/utils/cn.util"

export function InfiniteMarquee({
  "aria-label": ariaLabel,
  className,
  durationSeconds = defaultMarqueeDurationSeconds,
  itemClassName,
  items,
  repeatCount,
  separator = defaultMarqueeSeparator,
  trackClassName,
}: InfiniteMarqueeProps) {
  const groupCount = getMarqueeGroupCount(repeatCount)
  const { firstGroupRef, groupWidth } = useMarqueeLoopWidth()

  return (
    <section
      aria-label={ariaLabel}
      className={cn("w-full overflow-hidden", className)}
    >
      <MarqueeTrack
        durationSeconds={durationSeconds}
        firstGroupRef={firstGroupRef}
        groupCount={groupCount}
        groupWidth={groupWidth}
        itemClassName={itemClassName}
        items={items}
        separator={separator}
        trackClassName={trackClassName}
      />
    </section>
  )
}
