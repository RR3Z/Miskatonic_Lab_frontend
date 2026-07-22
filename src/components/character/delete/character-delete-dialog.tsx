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
import localizedContent from "@/data/locales/ru/character/list.ru.json"
import type { CharacterListItem } from "@/types/character.types"

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
      toast.error(
        localizedContent.copy.componentsCharacterDeleteCharacterDeleteDialog
          .neUdalosUdalitPersonazhaPoprobuiteEsche,
        {
          id: `character-delete-error-${character.id}`,
        },
      )
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
            {
              localizedContent.copy
                .componentsCharacterDeleteCharacterDeleteDialog.udalitPersonazha
            }
          </AlertDialogTitle>
          <AlertDialogDescription>
            {
              localizedContent.copy
                .componentsCharacterDeleteCharacterDeleteDialog.personazh
            }
            {character.name}
            {
              localizedContent.copy
                .componentsCharacterDeleteCharacterDeleteDialog
                .budetUdalenBezVozmozhnostiVosstanovleniya
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-stretch">
          <AlertDialogCancel
            className="w-full border-[var(--ml-border-aged)] hover:border-[var(--ml-accent-brass-strong)] sm:flex-1"
            disabled={isDeleting}
            onClick={onCancelFocus}
            variant="secondary"
          >
            {
              localizedContent.copy
                .componentsCharacterDeleteCharacterDeleteDialog.otmena
            }
          </AlertDialogCancel>
          <Button
            className="w-full sm:flex-1"
            disabled={isDeleting}
            onClick={handleDelete}
            type="button"
            variant="destructive"
          >
            {isDeleting ? (
              <Spinner
                aria-label={
                  localizedContent.copy
                    .componentsCharacterDeleteCharacterDeleteDialog
                    .udaleniePersonazha
                }
              />
            ) : (
              localizedContent.copy
                .componentsCharacterDeleteCharacterDeleteDialog.udalit
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
