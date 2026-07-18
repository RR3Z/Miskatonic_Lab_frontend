"use client"

import { motion } from "motion/react"

type GuideSearchHighlightProps = {
  active: boolean
}

export function GuideSearchHighlight({ active }: GuideSearchHighlightProps) {
  if (!active) {
    return null
  }

  return (
    <motion.span
      animate={{ opacity: [0, 0.9, 0.46, 0] }}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,rgba(205,177,93,0.38),rgba(182,163,103,0.18)_42%,transparent_78%)]"
      initial={{ opacity: 0 }}
      transition={{ delay: 0.15, duration: 1.8, ease: "easeOut" }}
    />
  )
}
