import type * as React from "react"

export const defaultMarqueeDurationSeconds = 26
export const minMarqueeRepeatCount = 3

export const defaultMarqueeSeparator: React.ReactNode = (
  <span aria-hidden="true" className="text-current">
    ·
  </span>
)
