"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, X } from "lucide-react"
import { useId, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import {
  type CreateCharacterNoteDto,
  type CreateCharacterNoteInput,
  createCharacterNoteDefaultValues,
  createCharacterNoteSchema,
  MAX_CHARACTER_NOTE_TITLE_LENGTH,
} from "@/dto/character/create-character-note.dto"
import { useCreateCharacterNote } from "@/lib/api/use-characters"

type CreateCharacterNoteDialogProps = {
  characterId: string
}

export function CreateCharacterNoteDialog({
  characterId,
}: CreateCharacterNoteDialogProps) {
  const [open, setOpen] = useState(false)
  const titleId = useId()
  const bodyId = useId()
  const mutation = useCreateCharacterNote(characterId)
  const form = useForm<
    CreateCharacterNoteInput,
    undefined,
    CreateCharacterNoteDto
  >({
    defaultValues: createCharacterNoteDefaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(createCharacterNoteSchema),
  })
  const isPending = mutation.isPending || form.formState.isSubmitting

  function handleOpenChange(nextOpen: boolean) {
    if (isPending) return
    setOpen(nextOpen)
    if (!nextOpen) {
      form.reset()
      mutation.reset()
    }
  }

  async function handleSubmit(data: CreateCharacterNoteDto) {
    try {
      await mutation.mutateAsync(data)
      toast.success("Заметка добавлена")
      form.reset()
      setOpen(false)
    } catch {
      toast.error("Не удалось добавить заметку. Попробуйте ещё раз.", {
        id: "character-note-create-error",
      })
    }
  }

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

        <form noValidate onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid gap-4">
            <Controller
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={titleId}>Заголовок</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    className="bg-[var(--ml-surface-panel-raised)]"
                    disabled={isPending}
                    id={titleId}
                    maxLength={MAX_CHARACTER_NOTE_TITLE_LENGTH}
                    placeholder="Например, Зацепка в архиве"
                    required
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="body"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={bodyId}>Текст</FieldLabel>
                  <Textarea
                    {...field}
                    aria-invalid={fieldState.invalid}
                    className="min-h-36 bg-[var(--ml-surface-panel-raised)]"
                    disabled={isPending}
                    id={bodyId}
                    placeholder="Что важно запомнить?"
                    required
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </div>

          <DialogFooter className="mt-5 sm:justify-stretch">
            <Button
              className="w-full sm:flex-1"
              disabled={isPending}
              onClick={() => handleOpenChange(false)}
              type="button"
              variant="destructive"
            >
              Отмена
            </Button>
            <Button
              className="w-full sm:flex-1"
              disabled={isPending}
              type="submit"
              variant="success"
            >
              {isPending ? (
                <>
                  <Spinner aria-hidden="true" data-icon="inline-start" />
                  Сохранение…
                </>
              ) : (
                "Добавить"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
