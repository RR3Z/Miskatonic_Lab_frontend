"use client"

import { Toaster as Sonner } from "sonner"

import {
  DICE_RESULT_TOAST_DURATION_MS,
  DICE_RESULT_TOASTER_ARIA_LABEL,
  DICE_RESULT_TOASTER_ID,
} from "@/components/ui/sonner/constants/sonner.constants"
import { diceResultToastOptions } from "@/components/ui/sonner/utils/toast-options.util"

export function DiceResultToaster() {
  return (
    <Sonner
      className="z-[100]"
      closeButton
      containerAriaLabel={DICE_RESULT_TOASTER_ARIA_LABEL}
      duration={DICE_RESULT_TOAST_DURATION_MS}
      id={DICE_RESULT_TOASTER_ID}
      position="bottom-right"
      theme="dark"
      toastOptions={diceResultToastOptions}
    />
  )
}
