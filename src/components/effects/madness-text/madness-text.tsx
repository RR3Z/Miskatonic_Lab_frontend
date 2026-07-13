"use client"

import * as React from "react"
import { MASKS_OF_NYARLATHOTEP_DATE_POOL } from "@/components/effects/madness-text/constants/masks-of-nyarlathotep-timeline"
import { DEFAULT_AUTO_DELAY_MS } from "@/components/effects/madness-text/constants/timing"
import { useMadnessAnimation } from "@/components/effects/madness-text/hooks/use-madness-animation"
import { useMeasuredTextWidth } from "@/components/effects/madness-text/hooks/use-measured-text-width"
import { TransformSkewGlitch } from "@/components/effects/madness-text/transform-skew-glitch"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils/cn.util"

type MadnessTextProps = {
  children: string
  className?: string
  hallucinationPool?: readonly string[]
  maxAutoDelayMs?: number
  minAutoDelayMs?: number
}

export function MadnessText({
  children,
  className,
  hallucinationPool = MASKS_OF_NYARLATHOTEP_DATE_POOL,
  maxAutoDelayMs = DEFAULT_AUTO_DELAY_MS.max,
  minAutoDelayMs = DEFAULT_AUTO_DELAY_MS.min,
}: MadnessTextProps) {
  const ref = React.useRef<HTMLButtonElement>(null)
  const maxWidth = useMeasuredTextWidth(ref, children, hallucinationPool)
  const animation = useMadnessAnimation({
    alternates: hallucinationPool,
    maxAutoDelayMs,
    minAutoDelayMs,
    original: children,
  })
  const rootClassName = cn(
    "relative h-auto min-w-0 rounded-none border-0 bg-transparent p-0 font-[inherit] text-inherit no-underline hover:bg-transparent hover:text-inherit hover:no-underline",
    className,
  )
  const style =
    maxWidth === null ? undefined : { overflow: "visible", width: maxWidth }

  return (
    <Button
      type="button"
      ref={ref}
      className={rootClassName}
      size="sm"
      style={style}
      variant="link"
      onBlur={animation.release}
      onFocus={animation.hold}
      onMouseEnter={animation.hold}
      onMouseLeave={animation.release}
    >
      <span className="sr-only">{children}</span>
      {animation.active ? (
        <span aria-hidden="true" className="relative block w-full">
          <TransformSkewGlitch
            key={animation.animationKey}
            text={animation.alternateText}
            original={children}
            onComplete={animation.complete}
          />
        </span>
      ) : (
        <span aria-hidden="true">{children}</span>
      )}
    </Button>
  )
}
