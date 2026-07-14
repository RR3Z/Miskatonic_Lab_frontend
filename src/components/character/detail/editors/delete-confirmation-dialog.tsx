"use client"

import { useState } from "react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export function DeleteConfirmationDialog({
  description,
  errorMessage,
  onConfirm,
  onOpenChange,
  open,
  title,
}: {
  description: string
  errorMessage: string
  onConfirm: () => Promise<unknown>
  onOpenChange: (open: boolean) => void
  open: boolean
  title: string
}) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleConfirm() {
    if (isDeleting) return
    setIsDeleting(true)

    try {
      await onConfirm()
      onOpenChange(false)
    } catch {
      toast.error(errorMessage)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog
      onOpenChange={(nextOpen) => {
        if (!isDeleting) onOpenChange(nextOpen)
      }}
      open={open}
    >
      <AlertDialogContent className="border border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel)] shadow-2xl sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-stretch">
          <AlertDialogCancel
            className="w-full sm:flex-1"
            disabled={isDeleting}
            variant="secondary"
          >
            Отмена
          </AlertDialogCancel>
          <Button
            className="w-full sm:flex-1"
            disabled={isDeleting}
            onClick={handleConfirm}
            type="button"
            variant="destructive"
          >
            {isDeleting ? <Spinner aria-label="Удаление" /> : "Удалить"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
