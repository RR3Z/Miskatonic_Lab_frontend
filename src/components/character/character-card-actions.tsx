"use client"

import { Ellipsis, Trash2 } from "lucide-react"
import { useRef, useState } from "react"

import { CharacterDeleteDialog } from "@/components/character/delete/character-delete-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  return (
    <>
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
            onSelect={() => setDeleteDialogOpen(true)}
          >
            <Trash2 aria-hidden="true" />
            Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CharacterDeleteDialog
        character={character}
        onCancelFocus={() => triggerRef.current?.focus()}
        onDelete={onDelete}
        onOpenChange={setDeleteDialogOpen}
        open={deleteDialogOpen}
      />
    </>
  )
}
