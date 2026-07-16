import { TOAST_CLOSE_BUTTON_ARIA_LABEL } from "@/components/ui/sonner/constants"

const baseToastClassName =
  "rounded-lg! border! border-[var(--ml-border-aged)]! bg-[var(--ml-surface-panel-raised)]! p-4! font-body! text-[var(--ml-ink-primary)]! shadow-[0_16px_40px_rgba(0,0,0,0.42)]!"

const closeButtonClassName =
  "border-current/35! bg-[var(--ml-surface-panel)]! text-current! hover:bg-[var(--ml-surface-panel-raised)]!"

function createToastClassNames(widthClassName: string) {
  return {
    toast: `${widthClassName} ${baseToastClassName}`,
    title: "text-base! leading-snug! font-semibold!",
    content: "gap-0.5!",
    icon: "text-current!",
    closeButton: closeButtonClassName,
  }
}

export const genericToastOptions = {
  closeButtonAriaLabel: TOAST_CLOSE_BUTTON_ARIA_LABEL,
  classNames: {
    ...createToastClassNames("w-[min(26rem,calc(100vw-2rem))]!"),
    description: "text-sm! text-current! opacity-80!",
    success:
      "border-[var(--ml-toast-success-border)]! bg-[var(--ml-toast-success-bg)]! text-[var(--ml-ink-primary)]! [&_[data-icon]]:text-[var(--ml-toast-success-accent)]!",
    error:
      "border-[var(--ml-toast-error-border)]! bg-[var(--ml-toast-error-bg)]! text-[var(--ml-ink-primary)]! [&_[data-icon]]:text-[var(--ml-toast-error-accent)]!",
    warning:
      "border-[var(--ml-toast-warning-border)]! bg-[var(--ml-toast-warning-bg)]! text-[var(--ml-ink-primary)]! [&_[data-icon]]:text-[var(--ml-toast-warning-accent)]!",
  },
}

export const diceResultToastOptions = {
  closeButtonAriaLabel: TOAST_CLOSE_BUTTON_ARIA_LABEL,
  classNames: createToastClassNames("w-[min(30rem,calc(100vw-2rem))]!"),
}
