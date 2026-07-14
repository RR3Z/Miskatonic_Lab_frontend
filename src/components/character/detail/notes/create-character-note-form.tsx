"use client"

import { useId } from "react"
import { Controller } from "react-hook-form"

import type { CreateCharacterNoteFormProps } from "@/components/character/detail/notes/create-character-note-form.types"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { MAX_CHARACTER_NOTE_TITLE_LENGTH } from "@/dto/character/create-character-note.dto"

export function CreateCharacterNoteForm({
  form,
  isPending,
  onCancel,
  onSubmit,
}: CreateCharacterNoteFormProps) {
  const titleId = useId()
  const bodyId = useId()

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
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
          onClick={onCancel}
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
  )
}
