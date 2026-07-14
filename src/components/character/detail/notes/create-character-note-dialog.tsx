"use client"

import { Plus, X } from "lucide-react"

import { CreateCharacterNoteForm } from "@/components/character/detail/notes/create-character-note-form"
import { useCreateCharacterNoteDialog } from "@/components/character/detail/notes/use-create-character-note-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function CreateCharacterNoteDialog({
  characterId,
}: {
  characterId: string
}) {
  const { form, handleOpenChange, handleSubmit, isPending, open } =
    useCreateCharacterNoteDialog(characterId)

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" type="button" variant="outline">
          <Plus aria-hidden="true" data-icon="inline-start" />
          Добавить заметку
        </Button>
      </DialogTrigger>
      <DialogContent
        className="border border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel)] text-[var(--ml-ink-primary)] shadow-2xl sm:max-w-lg"
        onInteractOutside={(event) => {
          if (isPending) event.preventDefault()
        }}
        showCloseButton={false}
      >
        <DialogHeader className="pr-9">
          <DialogTitle className="text-xl">Новая заметка</DialogTitle>
          <DialogDescription>
            Сохраните зацепку, имя или важную деталь расследования.
          </DialogDescription>
        </DialogHeader>
        <DialogClose asChild>
          <Button
            aria-label="Закрыть окно создания заметки"
            className="absolute top-2 right-2"
            disabled={isPending}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <X aria-hidden="true" />
          </Button>
        </DialogClose>

        <CreateCharacterNoteForm
          form={form}
          isPending={isPending}
          onCancel={() => handleOpenChange(false)}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}
