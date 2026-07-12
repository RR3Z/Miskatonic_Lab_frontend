"use client"

import { X } from "lucide-react"
import { Dialog } from "radix-ui"
import type * as React from "react"

import { cn } from "@/lib/utils/cn.util"

const Sheet = Dialog.Root
const SheetTrigger = Dialog.Trigger
const SheetClose = Dialog.Close

function SheetContent({
  children,
  className,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof Dialog.Content> & {
  showCloseButton?: boolean
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[1px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
      <Dialog.Content
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-[min(88vw,22rem)] flex-col border-l border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel)] text-[var(--ml-ink-primary)] shadow-2xl outline-none data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:animate-in data-[state=open]:slide-in-from-right",
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <Dialog.Close
            aria-label="Закрыть меню"
            className="absolute top-4 right-4 inline-flex size-9 items-center justify-center rounded-md text-[var(--ml-ink-muted)] transition-colors hover:bg-[var(--ml-surface-panel-raised)] hover:text-[var(--ml-ink-primary)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <X aria-hidden="true" />
          </Dialog.Close>
        )}
      </Dialog.Content>
    </Dialog.Portal>
  )
}

const SheetTitle = Dialog.Title
const SheetDescription = Dialog.Description

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
}
