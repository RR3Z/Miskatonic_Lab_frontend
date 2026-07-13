"use client"

import { Ellipsis, Trash2 } from "lucide-react"
import { useRef, useState } from "react"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"
import type { CharacterListItem } from "@/types/character"

type CharacterCardActionsProps = {
  character: Pick<CharacterListItem, "id" | "name">
  onDelete: (characterId: string) => Promise<void>
}

export function CharacterCardActions({
  character,
  onDelete,
}: CharacterCardActionsProps) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (isDeleting) return

    setIsDeleting(true)

    try {
      await onDelete(character.id)
      setDialogOpen(false)
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
      onOpenChange={(open) => {
        if (!isDeleting) setDialogOpen(open)
      }}
      open={dialogOpen}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label={`Действия персонажа ${character.name}`}
            className="hidden shrink-0 sm:inline-flex"
            ref={triggerRef}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <Ellipsis aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-36" sideOffset={5}>
          <DropdownMenuItem
            className="cursor-pointer text-[var(--ml-clerk-danger)]! [&_svg]:text-[var(--ml-clerk-danger)]!"
            variant="destructive"
            onSelect={() => {
              setDialogOpen(true)
            }}
          >
            <Trash2 aria-hidden="true" />
            Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
            onClick={() => triggerRef.current?.focus()}
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
