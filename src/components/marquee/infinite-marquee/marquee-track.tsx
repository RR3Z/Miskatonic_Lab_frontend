"use client"

import { motion, useReducedMotion } from "motion/react"
import * as React from "react"
import { MarqueeGroup } from "@/components/marquee/infinite-marquee/marquee-group"
import {
  getMarqueeGroupIds,
  isFirstMarqueeGroup,
} from "@/components/marquee/infinite-marquee/utils/infinite-marquee.util"
import { cn } from "@/lib/utils/cn.util"

type MarqueeTrackProps = {
  durationSeconds: number
  firstGroupRef: React.Ref<HTMLDivElement>
  groupCount: number
  groupWidth: number
  itemClassName?: string
  items: readonly string[]
  separator: React.ReactNode
  trackClassName?: string
}

export function MarqueeTrack({
  durationSeconds,
  firstGroupRef,
  groupCount,
  groupWidth,
  itemClassName,
  items,
  separator,
  trackClassName,
}: MarqueeTrackProps) {
  const shouldReduceMotion = useReducedMotion()
  const groupIds = React.useMemo(
    () => getMarqueeGroupIds(groupCount),
    [groupCount],
  )

  return (
    <motion.div
      animate={shouldReduceMotion ? { x: 0 } : { x: -groupWidth }}
      className={cn("flex w-max items-center", trackClassName)}
      data-testid="infinite-marquee-track"
      initial={{ x: "0%" }}
      transition={
        shouldReduceMotion
          ? undefined
          : {
              duration: durationSeconds,
              ease: "linear",
              repeat: Number.POSITIVE_INFINITY,
            }
      }
    >
      {groupIds.map((groupId) => (
        <MarqueeGroup
          groupRef={isFirstMarqueeGroup(groupId) ? firstGroupRef : undefined}
          idPrefix={groupId}
          itemClassName={itemClassName}
          items={items}
          key={groupId}
          separator={separator}
        />
      ))}
    </motion.div>
  )
}
