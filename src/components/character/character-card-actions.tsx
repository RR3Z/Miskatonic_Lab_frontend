"use client"

import { Ellipsis, Trash2 } from "lucide-react"
import { useRef, useState } from "react"
import { CharacterDeleteDialog } from "@/components/character/delete/character-delete-dialog"
import { Button } from "@/components/ui/button"
import { DropdownMenu } from "@/components/ui/dropdown-menu/dropdown-menu"
import { DropdownMenuContent } from "@/components/ui/dropdown-menu/dropdown-menu-content"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu/dropdown-menu-item"
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu/dropdown-menu-trigger"
import localizedContent from "@/data/locales/ru/character/list.ru.json"
import { formatLocalizedTemplate } from "@/data/locales/utils/format-localized-template.util"
import type { CharacterListItem } from "@/types/character.types"

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
            aria-label={formatLocalizedTemplate(
              localizedContent.copy.componentsCharacterCharacterCardActions
                .deistviyaPersonazhaValue0,
              { value0: character.name },
            )}
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
            {
              localizedContent.copy.componentsCharacterCharacterCardActions
                .udalit
            }
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
