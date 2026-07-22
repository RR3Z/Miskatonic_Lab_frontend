"use client"

import { AlertDialog as AlertDialogPrimitive } from "radix-ui"

import type * as React from "react"

export function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  )
}
