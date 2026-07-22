import type { Variants } from "motion/react"

const motionEase = [0.22, 1, 0.36, 1] as const

export const characterItemVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: (index: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: Math.min(index * 0.035, 0.18),
      duration: 0.24,
      ease: motionEase,
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -6,
    transition: { duration: 0.22, ease: motionEase },
  },
  reducedExit: { opacity: 0, transition: { duration: 0 } },
}

export const deleteOverlayVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 0 },
  exit: {
    opacity: 0.2,
    transition: { duration: 0.11, ease: "easeOut" },
  },
  reducedExit: { opacity: 0, transition: { duration: 0 } },
}

export const createItemVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: Math.min(index * 0.035, 0.18),
      duration: 0.24,
      ease: motionEase,
    },
  }),
  exit: {
    opacity: 0,
    y: 4,
    transition: { duration: 0.22, ease: motionEase },
  },
  reducedExit: { opacity: 0, transition: { duration: 0 } },
}
