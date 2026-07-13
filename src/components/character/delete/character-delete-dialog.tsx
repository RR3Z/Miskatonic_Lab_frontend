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
import type { CharacterListItem } from "@/types/character"

type CharacterDeleteDialogProps = {
  character: Pick<CharacterListItem, "id" | "name">
  onCancelFocus: () => void
  onDelete: (characterId: string) => Promise<void>
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function CharacterDeleteDialog({
  character,
  onCancelFocus,
  onDelete,
  onOpenChange,
  open,
}: CharacterDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (isDeleting) return

    setIsDeleting(true)

    try {
      await onDelete(character.id)
      onOpenChange(false)
    } catch {
      toast.error("Не удалось удалить персонажа. Попробуйте ещё раз.", {
        id: `character-delete-error-${character.id}`,
      })
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
          <AlertDialogTitle className="text-xl">
            Удалить персонажа?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Персонаж «{character.name}» будет удалён без возможности
            восстановления.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-stretch">
          <AlertDialogCancel
            className="w-full border-[var(--ml-border-aged)] hover:border-[var(--ml-accent-brass-strong)] sm:flex-1"
            disabled={isDeleting}
            onClick={onCancelFocus}
            variant="secondary"
          >
            Отмена
          </AlertDialogCancel>
          <Button
            className="w-full sm:flex-1"
            disabled={isDeleting}
            onClick={handleDelete}
            type="button"
            variant="destructive"
          >
            {isDeleting ? (
              <Spinner aria-label="Удаление персонажа" />
            ) : (
              "Удалить"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
