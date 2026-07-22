"use client"

import { useState } from "react"
import { toast } from "sonner"
import { AlertDialog } from "@/components/ui/alert-dialog/alert-dialog"
import { AlertDialogCancel } from "@/components/ui/alert-dialog/alert-dialog-cancel"
import { AlertDialogContent } from "@/components/ui/alert-dialog/alert-dialog-content"
import { AlertDialogDescription } from "@/components/ui/alert-dialog/alert-dialog-description"
import { AlertDialogFooter } from "@/components/ui/alert-dialog/alert-dialog-footer"
import { AlertDialogHeader } from "@/components/ui/alert-dialog/alert-dialog-header"
import { AlertDialogTitle } from "@/components/ui/alert-dialog/alert-dialog-title"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"

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
            {
              localizedContent.copy
                .characterDetailEditorsDeleteConfirmationDialog.otmena
            }
          </AlertDialogCancel>
          <Button
            className="w-full sm:flex-1"
            disabled={isDeleting}
            onClick={handleConfirm}
            type="button"
            variant="destructive"
          >
            {isDeleting ? (
              <Spinner
                aria-label={
                  localizedContent.copy
                    .characterDetailEditorsDeleteConfirmationDialog.udalenie
                }
              />
            ) : (
              localizedContent.copy
                .characterDetailEditorsDeleteConfirmationDialog.udalit
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
