import * as React from "react"
import { pickRandom, randomInt } from "@/lib/utils/random.util"

type UseMadnessAnimationParams = {
  alternates: readonly string[]
  maxAutoDelayMs: number
  minAutoDelayMs: number
  original: string
}

export function useMadnessAnimation({
  alternates,
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
      if (active && !force) return
      const candidates = alternates.filter((item) => item !== original)
      const pool = candidates.length > 0 ? candidates : alternates
      if (pool.length === 0) return

      setAlternateText(pickRandom(pool))
      setAnimationKey((key) => key + 1)
      setActive(true)
    },
    [active, alternates, original],
  )

  const complete = React.useCallback(() => {
    if (isHeldRef.current) {
      trigger(true)
      return
    }
    setActive(false)
  }, [trigger])

  const hold = React.useCallback(() => {
    isHeldRef.current = true
    trigger()
  }, [trigger])

  const release = React.useCallback(() => {
    isHeldRef.current = false
  }, [])

  React.useEffect(() => {
    if (active) return
    const timeout = window.setTimeout(
      trigger,
      randomInt(minAutoDelayMs, maxAutoDelayMs),
    )

    return () => window.clearTimeout(timeout)
  }, [active, maxAutoDelayMs, minAutoDelayMs, trigger])

  return {
    active,
    alternateText,
    animationKey,
    complete,
    hold,
    release,
  }
}
