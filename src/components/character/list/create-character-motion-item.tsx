import { motion } from "motion/react"
import { forwardRef, type ReactNode } from "react"

import { createItemVariants } from "@/components/character/list/styles/character-list-motion.styles"

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
