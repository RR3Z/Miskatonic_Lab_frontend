import type { GlitchFrame } from "@/components/effects/madness-text/types/madness-text.types"

export const stableGlitchFrame: GlitchFrame = {
  skew: 0,
  x: 0,
  y: 0,
}

export function createRandomGlitchFrame(): GlitchFrame {
  return {
    skew: (Math.random() - 0.5) * 8,
    x: (Math.random() - 0.5) * 10,
    y: (Math.random() - 0.5) * 6,
  }
}
