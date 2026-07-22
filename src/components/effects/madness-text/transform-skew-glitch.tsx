"use client"

import * as React from "react"
import {
  GLITCH_FRAME_INTERVAL_MS,
  GLITCH_PHASE_DURATION_MS,
} from "@/components/effects/madness-text/constants/timing.constants"
import type { GlitchPhase } from "@/components/effects/madness-text/types/madness-text.types"
import {
  createRandomGlitchFrame,
  stableGlitchFrame,
} from "@/components/effects/madness-text/utils/madness-glitch-frame.util"

type Props = {
  text: string
  original: string
  onComplete?: () => void
}

export function TransformSkewGlitch({ text, original, onComplete }: Props) {
  const [phase, setPhase] = React.useState<GlitchPhase>("original")
  const [frame, setFrame] = React.useState(stableGlitchFrame)
  const mountedRef = React.useRef(true)

  React.useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!mountedRef.current) return
      setFrame(createRandomGlitchFrame())
    }, GLITCH_FRAME_INTERVAL_MS)

    const t = setTimeout(() => {
      if (!mountedRef.current) return
      if (phase === "original") {
        setPhase("alternate")
        return
      }
      if (phase === "alternate") {
        setPhase("restore")
        return
      }

      setFrame(stableGlitchFrame)
      onComplete?.()
    }, GLITCH_PHASE_DURATION_MS[phase])

    return () => {
      clearInterval(interval)
      clearTimeout(t)
    }
  }, [phase, onComplete])

  const visibleText = phase === "alternate" ? text : original

  return (
    <span className="relative inline-flex items-center" aria-hidden="true">
      <span className="sr-only">{original}</span>

      <span
        className="relative z-10"
        style={{
          transform: `translate(${frame.x}px, ${frame.y}px) skewX(${frame.skew}deg)`,
          transition: "none",
        }}
      >
        {visibleText}
      </span>

      <span
        className="pointer-events-none absolute inset-0 z-20 select-none"
        style={{
          color: "#4a3728",
          transform: `translate(${-frame.x * 1.2 + 1}px, ${frame.y * 0.4}px) skewX(${-frame.skew * 1.1}deg)`,
          mixBlendMode: "multiply",
          transition: "none",
        }}
      >
        {visibleText}
      </span>

      <span
        className="pointer-events-none absolute inset-0 z-20 select-none"
        style={{
          color: "#2a1f14",
          transform: `translate(${frame.x * 1.2 - 1}px, ${-frame.y * 0.4}px) skewX(${frame.skew * 1.1}deg)`,
          mixBlendMode: "multiply",
          transition: "none",
        }}
      >
        {visibleText}
      </span>
    </span>
  )
}
