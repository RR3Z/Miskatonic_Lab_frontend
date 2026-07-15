"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"

export const DICE_RESULT_TOASTER_ID = "dice-results"
export const TOAST_DURATION_MS = 30_000

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      closeButton
      containerAriaLabel="Уведомления"
      duration={TOAST_DURATION_MS}
      position="top-center"
      theme="dark"
      toastOptions={{
        closeButtonAriaLabel: "Закрыть уведомление",
        classNames: {
          toast:
            "w-[min(26rem,calc(100vw-2rem))]! rounded-lg! border! border-[var(--ml-border-aged)]! bg-[var(--ml-surface-panel-raised)]! p-4! font-body! text-[var(--ml-ink-primary)]! shadow-[0_16px_40px_rgba(0,0,0,0.42)]!",
          title: "text-base! leading-snug! font-semibold!",
          description: "text-sm! text-current! opacity-80!",
          content: "gap-0.5!",
          icon: "text-current!",
          closeButton:
            "border-current/35! bg-[var(--ml-surface-panel)]! text-current! hover:bg-[var(--ml-surface-panel-raised)]!",
          success:
            "border-[var(--ml-toast-success-border)]! bg-[var(--ml-toast-success-bg)]! text-[var(--ml-ink-primary)]! [&_[data-icon]]:text-[var(--ml-toast-success-accent)]!",
          error:
            "border-[var(--ml-toast-error-border)]! bg-[var(--ml-toast-error-bg)]! text-[var(--ml-ink-primary)]! [&_[data-icon]]:text-[var(--ml-toast-error-accent)]!",
          warning:
            "border-[var(--ml-toast-warning-border)]! bg-[var(--ml-toast-warning-bg)]! text-[var(--ml-ink-primary)]! [&_[data-icon]]:text-[var(--ml-toast-warning-accent)]!",
        },
      }}
      {...props}
    />
  )
}
