"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      closeButton
      position="top-right"
      theme="dark"
      toastOptions={{
        classNames: {
          toast:
            "border-[var(--ml-border-aged)]! bg-[var(--ml-surface-panel-raised)]! text-[var(--ml-ink-primary)]!",
          description: "text-[var(--ml-ink-muted)]!",
          error: "border-[var(--ml-clerk-danger-border)]!",
        },
      }}
      {...props}
    />
  )
}
