import { motion, type Variants } from "motion/react"
import { forwardRef, type ReactNode } from "react"

const motionEase = [0.22, 1, 0.36, 1] as const

const characterItemVariants: Variants = {
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
  reducedExit: {
    opacity: 0,
    transition: { duration: 0 },
  },
}

const deleteOverlayVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 0 },
  exit: {
    opacity: 0.2,
    transition: { duration: 0.11, ease: "easeOut" },
  },
  reducedExit: { opacity: 0, transition: { duration: 0 } },
}

const createItemVariants: Variants = {
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
  reducedExit: {
    opacity: 0,
    transition: { duration: 0 },
  },
}

type CharacterListMotionItemProps = {
  children: ReactNode
  index: number
  reducedMotion: boolean
}

export const CharacterListMotionItem = forwardRef<
  HTMLDivElement,
  CharacterListMotionItemProps
>(function CharacterListMotionItem({ children, index, reducedMotion }, ref) {
  return (
    <motion.div
      animate="animate"
      className="relative min-w-0"
      custom={index}
      data-slot="character-motion-item"
      exit={reducedMotion ? "reducedExit" : "exit"}
      initial={reducedMotion ? false : "initial"}
      layout={reducedMotion ? false : "position"}
      ref={ref}
      variants={characterItemVariants}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 rounded-md bg-destructive"
        data-slot="character-delete-overlay"
        variants={deleteOverlayVariants}
      />
      {children}
    </motion.div>
  )
})

type CreateCharacterMotionItemProps = {
  children: ReactNode
  index: number
  reducedMotion: boolean
}

export const CreateCharacterMotionItem = forwardRef<
  HTMLDivElement,
  CreateCharacterMotionItemProps
>(function CreateCharacterMotionItem({ children, index, reducedMotion }, ref) {
  return (
    <motion.div
      animate="animate"
      className="relative min-w-0"
      custom={index}
      data-slot="create-character-motion-item"
      exit={reducedMotion ? "reducedExit" : "exit"}
      initial={reducedMotion ? false : "initial"}
      layout={reducedMotion ? false : "position"}
      ref={ref}
      variants={createItemVariants}
    >
      {children}
    </motion.div>
  )
})
