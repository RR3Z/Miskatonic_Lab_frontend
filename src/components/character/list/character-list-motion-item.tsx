import { motion } from "motion/react"
import { forwardRef, type ReactNode } from "react"

import {
  characterItemVariants,
  deleteOverlayVariants,
} from "@/components/character/list/styles/character-list-motion.styles"

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
