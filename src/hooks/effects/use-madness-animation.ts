import * as React from "react"
import { pickRandom, randomInt } from "@/lib/utils/random.util"

type UseMadnessAnimationParams = {
  alternates: readonly string[]
  disabled?: boolean
  maxAutoDelayMs: number
  minAutoDelayMs: number
  original: string
}

export function useMadnessAnimation({
  alternates,
  disabled = false,
  maxAutoDelayMs,
  minAutoDelayMs,
  original,
}: UseMadnessAnimationParams) {
  const [active, setActive] = React.useState(false)
  const [animationKey, setAnimationKey] = React.useState(0)
  const [alternateText, setAlternateText] = React.useState(original)
  const isHeldRef = React.useRef(false)

  const trigger = React.useCallback(
    (force = false) => {
      if (disabled) return
      if (active && !force) return
      const candidates = alternates.filter((item) => item !== original)
      const pool = candidates.length > 0 ? candidates : alternates
      if (pool.length === 0) return

      setAlternateText(pickRandom(pool))
      setAnimationKey((key) => key + 1)
      setActive(true)
    },
    [active, alternates, disabled, original],
  )

  const complete = React.useCallback(() => {
    if (isHeldRef.current) {
      trigger(true)
      return
    }
    setActive(false)
  }, [trigger])

  const hold = React.useCallback(() => {
    if (disabled) return
    isHeldRef.current = true
    trigger()
  }, [disabled, trigger])

  const release = React.useCallback(() => {
    isHeldRef.current = false
  }, [])

  React.useEffect(() => {
    if (disabled || active) return
    const timeout = window.setTimeout(
      trigger,
      randomInt(minAutoDelayMs, maxAutoDelayMs),
    )

    return () => window.clearTimeout(timeout)
  }, [active, disabled, maxAutoDelayMs, minAutoDelayMs, trigger])

  React.useEffect(() => {
    if (!disabled) return
    isHeldRef.current = false
    setActive(false)
  }, [disabled])

  return {
    active,
    alternateText,
    animationKey,
    complete,
    hold,
    release,
  }
}
