import type { GlitchPhase } from "@/components/effects/madness-text/types/madness-text.types"

export const DEFAULT_AUTO_DELAY_MS = {
  max: 40_000,
  min: 20_000,
} as const

export const GLITCH_FRAME_INTERVAL_MS = 60

export const GLITCH_PHASE_DURATION_MS: Record<GlitchPhase, number> = {
  alternate: 1050,
  original: 260,
  restore: 320,
}
