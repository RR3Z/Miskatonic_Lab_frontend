import type * as React from "react"

export type InfiniteMarqueeProps = {
  "aria-label": string
  className?: string
  durationSeconds?: number
  itemClassName?: string
  items: readonly string[]
  repeatCount?: number
  separator?: React.ReactNode
  trackClassName?: string
}

export type MarqueeItem = {
  id: string
  value: string
}
