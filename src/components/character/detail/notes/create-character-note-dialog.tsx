"use client"

import { X } from "lucide-react"
import { useId } from "react"
import type { FieldErrors } from "react-hook-form"
import { Controller } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog/dialog"
import { DialogClose } from "@/components/ui/dialog/dialog-close"
import { DialogContent } from "@/components/ui/dialog/dialog-content"
import { DialogFooter } from "@/components/ui/dialog/dialog-footer"
import { DialogHeader } from "@/components/ui/dialog/dialog-header"
import { DialogTitle } from "@/components/ui/dialog/dialog-title"
import { Field } from "@/components/ui/field/field"
import { FieldLabel } from "@/components/ui/field/field-label"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"
import { MAX_CHARACTER_NOTE_TITLE_LENGTH } from "@/dto/character/create-character-note.dto"
import { useCreateCharacterNoteForm } from "@/hooks/character/use-create-character-note-form"

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
    toast.error(
      error?.message ??
        localizedContent.copy.characterDetailNotesCreateCharacterNoteDialog
          .proverteDannyeZametki,
      {
        id: "character-note-validation-error",
      },
    )
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
            {
              localizedContent.copy
                .characterDetailNotesCreateCharacterNoteDialog.novayaZametka
            }
          </DialogTitle>
        </DialogHeader>
        <DialogClose asChild>
          <Button
            aria-label={
              localizedContent.copy
                .characterDetailNotesCreateCharacterNoteDialog
                .zakrytOknoNovayaZametka
            }
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
                  <FieldLabel htmlFor={titleId}>
                    {
                      localizedContent.copy
                        .characterDetailNotesCreateCharacterNoteDialog.zagolovok
                    }
                  </FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    className="font-heading text-base font-semibold"
                    disabled={isPending}
                    id={titleId}
                    maxLength={MAX_CHARACTER_NOTE_TITLE_LENGTH}
                    placeholder={
                      localizedContent.copy
                        .characterDetailNotesCreateCharacterNoteDialog
                        .novayaZametka
                    }
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
                  <FieldLabel htmlFor={bodyId}>
                    {
                      localizedContent.copy
                        .characterDetailNotesCreateCharacterNoteDialog.tekst
                    }
                  </FieldLabel>
                  <Textarea
                    {...field}
                    aria-invalid={fieldState.invalid}
                    className="min-h-32 py-2 text-sm leading-6"
                    disabled={isPending}
                    id={bodyId}
                    placeholder={
                      localizedContent.copy
                        .characterDetailNotesCreateCharacterNoteDialog
                        .chtoVazhnoZapomnit
                    }
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
              {
                localizedContent.copy
                  .characterDetailNotesCreateCharacterNoteDialog.otmena
              }
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
                  {
                    localizedContent.copy
                      .characterDetailNotesCreateCharacterNoteDialog.sohranenie
                  }
                </>
              ) : (
                localizedContent.copy
                  .characterDetailNotesCreateCharacterNoteDialog.dobavit
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
