"use client"

import { Dialog as DialogPrimitive } from "radix-ui"

import type * as React from "react"

import { Button } from "@/components/ui/button"
import localizedContent from "@/data/locales/ru/common/ui.ru.json"
import { cn } from "@/lib/utils/cn.util"

export function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">
            {localizedContent.copy.componentsUiDialog.zakryt}
          </Button>
        </DialogPrimitive.Close>
      )}
    </div>
  )
}
