"use client"

import { Toaster as Sonner } from "sonner"

import {
  GENERIC_TOAST_DURATION_MS,
  GENERIC_TOASTER_ARIA_LABEL,
} from "@/components/ui/sonner/constants/sonner.constants"
import { genericToastOptions } from "@/components/ui/sonner/utils/toast-options.util"

export function GenericToaster() {
  return (
    <Sonner
      closeButton
      containerAriaLabel={GENERIC_TOASTER_ARIA_LABEL}
      duration={GENERIC_TOAST_DURATION_MS}
      position="top-center"
      theme="dark"
      toastOptions={genericToastOptions}
    />
  )
}
