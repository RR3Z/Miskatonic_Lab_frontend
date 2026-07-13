"use client"

import { Ellipsis, Trash2 } from "lucide-react"
import { AlertDialog, DropdownMenu } from "radix-ui"
import { useRef, useState } from "react"
import { toast } from "sonner"

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
    <AlertDialog.Root
      onOpenChange={(open) => {
        if (!isDeleting) setDialogOpen(open)
      }}
      open={dialogOpen}
    >
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            aria-label={`Действия персонажа ${character.name}`}
            className="hidden size-7 shrink-0 items-center justify-center rounded-sm text-[var(--ml-ink-muted)] transition-colors hover:bg-[var(--ml-surface-panel-raised)] hover:text-[var(--ml-ink-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ml-focus-ring)] sm:inline-flex"
            ref={triggerRef}
            type="button"
          >
            <Ellipsis aria-hidden="true" className="size-5" />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            className="z-50 min-w-36 rounded-md border border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel-raised)] p-1 text-[var(--ml-ink-primary)] shadow-xl outline-none"
            sideOffset={5}
          >
            <DropdownMenu.Item
              className="flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 font-body text-sm text-[var(--ml-clerk-danger)] outline-none data-[highlighted]:bg-[var(--ml-clerk-danger-bg)]"
              onSelect={() => {
                setDialogOpen(true)
              }}
            >
              <Trash2 aria-hidden="true" className="size-4" />
              Удалить
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/65 backdrop-blur-[1px] data-[state=closed]:animate-out data-[state=open]:animate-in" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 z-50 w-[min(92vw,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-md border border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel)] p-5 text-[var(--ml-ink-primary)] shadow-2xl outline-none">
          <AlertDialog.Title className="font-heading text-xl">
            Удалить персонажа?
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 font-body text-sm leading-relaxed text-[var(--ml-ink-muted)]">
            Персонаж «{character.name}» будет удалён без возможности
            восстановления.
          </AlertDialog.Description>
          <div className="mt-5 flex justify-end gap-2">
            <AlertDialog.Cancel asChild>
              <button
                className="rounded-md border border-[var(--ml-border-subtle)] px-3 py-2 font-body text-sm transition-colors hover:bg-[var(--ml-surface-panel-raised)] disabled:cursor-wait disabled:opacity-50"
                disabled={isDeleting}
                onClick={() => triggerRef.current?.focus()}
                type="button"
              >
                Отмена
              </button>
            </AlertDialog.Cancel>
            <button
              className="rounded-md border border-[var(--ml-clerk-danger-border)] bg-[var(--ml-clerk-danger-bg)] px-3 py-2 font-body text-sm text-[var(--ml-clerk-danger)] transition-colors hover:brightness-110 disabled:cursor-wait disabled:opacity-60"
              disabled={isDeleting}
              onClick={handleDelete}
              type="button"
            >
              {isDeleting ? "Удаление…" : "Удалить"}
            </button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
