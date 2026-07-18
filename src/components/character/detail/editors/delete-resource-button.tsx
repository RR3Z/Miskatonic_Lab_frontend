"use client"

import { Trash2 } from "lucide-react"
import { useState } from "react"

import { DeleteConfirmationDialog } from "@/components/character/detail/editors/delete-confirmation-dialog"
import { Button } from "@/components/ui/button"

export function DeleteResourceButton({
  ariaLabel,
  className,
  description,
  errorMessage,
  onDelete,
  title,
  variant = "ghost",
}: {
  ariaLabel: string
  className?: string
  description: string
  errorMessage: string
  onDelete: () => Promise<unknown>
  title: string
  variant?: "destructive" | "ghost"
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        aria-label={ariaLabel}
        className={className}
        onClick={() => setOpen(true)}
        size="icon-sm"
        type="button"
        variant={variant}
      >
        <Trash2 aria-hidden="true" />
      </Button>
      <DeleteConfirmationDialog
        description={description}
        errorMessage={errorMessage}
        onConfirm={onDelete}
        onOpenChange={setOpen}
        open={open}
        title={title}
      />
    </>
  )
}
