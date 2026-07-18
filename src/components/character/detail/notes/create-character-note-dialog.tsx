"use client"

import { X } from "lucide-react"
import { useId } from "react"
import type { FieldErrors } from "react-hook-form"
import { Controller } from "react-hook-form"
import { toast } from "sonner"

import { useCreateCharacterNoteForm } from "@/components/character/detail/notes/use-create-character-note-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { MAX_CHARACTER_NOTE_TITLE_LENGTH } from "@/dto/character/create-character-note.dto"

export function CreateCharacterNoteDialog({
  characterId,
  onOpenChange,
  open,
}: {
  characterId: string
  onOpenChange: (open: boolean) => void
  open: boolean
}) {
  const titleId = useId()
  const bodyId = useId()
  const { form, handleSubmit, isPending } = useCreateCharacterNoteForm({
    characterId,
    onCreated: handleCreated,
  })

  function handleCreated() {
    onOpenChange(false)
  }

  function closeDialog() {
    if (isPending) return
    form.reset()
    onOpenChange(false)
  }

  function handleInvalid(errors: FieldErrors<{ body: string; title: string }>) {
    const error = errors.title ?? errors.body
    toast.error(error?.message ?? "Проверьте данные заметки", {
      id: "character-note-validation-error",
    })
  }

  return (
    <Dialog
      onOpenChange={(nextOpen) => {
        if (nextOpen) onOpenChange(true)
        else closeDialog()
      }}
      open={open}
    >
      <DialogContent
        className="max-h-[calc(100dvh-2rem)] overflow-x-hidden overflow-y-auto border border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel)] text-[var(--ml-ink-primary)] shadow-2xl sm:max-w-md"
        showCloseButton={false}
      >
        <DialogHeader className="items-center border-b border-[var(--ml-border-subtle)] pb-3 text-center">
          <DialogTitle className="font-heading text-xl font-semibold tracking-wide">
            Новая заметка
          </DialogTitle>
        </DialogHeader>
        <DialogClose asChild>
          <Button
            aria-label="Закрыть окно: Новая заметка"
            className="absolute top-2 right-2"
            disabled={isPending}
            onClick={closeDialog}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <X aria-hidden="true" />
          </Button>
        </DialogClose>

        <form
          className="grid gap-4"
          noValidate
          onSubmit={form.handleSubmit(handleSubmit, handleInvalid)}
        >
          <div className="grid gap-3">
            <Controller
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={titleId}>Заголовок</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    className="font-heading text-base font-semibold"
                    disabled={isPending}
                    id={titleId}
                    maxLength={MAX_CHARACTER_NOTE_TITLE_LENGTH}
                    placeholder="Новая заметка"
                    required
                  />
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
                    className="min-h-32 py-2 text-sm leading-6"
                    disabled={isPending}
                    id={bodyId}
                    placeholder="Что важно запомнить?"
                    required
                    size="lg"
                  />
                </Field>
              )}
            />
          </div>

          <DialogFooter>
            <Button
              className="w-full sm:flex-1"
              disabled={isPending}
              onClick={closeDialog}
              type="button"
              variant="secondary"
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
