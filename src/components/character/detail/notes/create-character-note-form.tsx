"use client"

import { useId } from "react"
import { Controller } from "react-hook-form"

import { useCreateCharacterNoteForm } from "@/components/character/detail/notes/use-create-character-note-form"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { MAX_CHARACTER_NOTE_TITLE_LENGTH } from "@/dto/character/create-character-note.dto"

export function CreateCharacterNoteForm({
  characterId,
  onCancel,
  onCreated,
}: {
  characterId: string
  onCancel: () => void
  onCreated: () => void
}) {
  const titleId = useId()
  const bodyId = useId()
  const { form, handleSubmit, isPending } = useCreateCharacterNoteForm({
    characterId,
    onCreated,
  })

  return (
    <form
      className="rounded-sm border border-[var(--ml-border-aged)] bg-[var(--ml-bg-page)]/20 p-3"
      noValidate
      onSubmit={form.handleSubmit(handleSubmit)}
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
                className="bg-[var(--ml-surface-panel-raised)] font-heading font-semibold"
                disabled={isPending}
                id={titleId}
                maxLength={MAX_CHARACTER_NOTE_TITLE_LENGTH}
                placeholder="Новая заметка"
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
                className="min-h-28 bg-[var(--ml-surface-panel-raised)]"
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

      <div className="mt-3 flex justify-end gap-2">
        <Button
          disabled={isPending}
          onClick={onCancel}
          type="button"
          variant="secondary"
        >
          Отмена
        </Button>
        <Button disabled={isPending} type="submit" variant="success">
          {isPending ? (
            <>
              <Spinner aria-hidden="true" data-icon="inline-start" />
              Сохранение…
            </>
          ) : (
            "Добавить"
          )}
        </Button>
      </div>
    </form>
  )
}
