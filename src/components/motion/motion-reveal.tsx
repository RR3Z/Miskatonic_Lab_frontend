"use client"

import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils/cn.util"

type MotionRevealProps = {
  children: React.ReactNode
  className?: string
  delay?: number
  distance?: number
}

export function MotionReveal({
  children,
  className,
  delay = 0,
  distance = 10,
}: MotionRevealProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={cn(className)}
      data-slot="motion-reveal"
      initial={shouldReduceMotion ? false : { opacity: 0.72, y: distance }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { delay, duration: 0.42, ease: [0.22, 1, 0.36, 1] }
      }
    >
      {children}
    </motion.div>
  )
}
