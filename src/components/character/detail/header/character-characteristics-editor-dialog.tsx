"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"
import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { CharacteristicInput } from "@/components/character/detail/header/characteristics-editor/characteristic-input"
import type { CharacteristicFormInput } from "@/components/character/detail/header/characteristics-editor/types/characteristics-editor.types"
import { getCharacteristicFormValues } from "@/components/character/detail/header/characteristics-editor/utils/characteristic-form-values.util"
import { getCharacterCharacteristics } from "@/components/character/detail/header/utils/character-characteristics.util"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog/dialog"
import { DialogClose } from "@/components/ui/dialog/dialog-close"
import { DialogContent } from "@/components/ui/dialog/dialog-content"
import { DialogDescription } from "@/components/ui/dialog/dialog-description"
import { DialogFooter } from "@/components/ui/dialog/dialog-footer"
import { DialogHeader } from "@/components/ui/dialog/dialog-header"
import { DialogTitle } from "@/components/ui/dialog/dialog-title"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"
import {
  characterNullableIntegerTextSchema,
  type UpdateCharacterCharacteristicsDto,
} from "@/dto/character/character-sheet-values.dto"
import { useUpdateCharacterCharacteristics } from "@/hooks/character/use-update-character-characteristics"
import type { CharacterDetail } from "@/types/character.types"

const characteristicsFormSchema = z.object({
  appearance: characterNullableIntegerTextSchema,
  constitution: characterNullableIntegerTextSchema,
  dexterity: characterNullableIntegerTextSchema,
  education: characterNullableIntegerTextSchema,
  intelligence: characterNullableIntegerTextSchema,
  power: characterNullableIntegerTextSchema,
  size: characterNullableIntegerTextSchema,
  strength: characterNullableIntegerTextSchema,
})

export function CharacterCharacteristicsEditorDialog({
  character,
  onOpenChange,
  open,
}: {
  character: CharacterDetail
  onOpenChange: (open: boolean) => void
  open: boolean
}) {
  const mutation = useUpdateCharacterCharacteristics(character.id)
  const defaultValues = useMemo(
    () => getCharacteristicFormValues(character),
    [character],
  )
  const form = useForm<CharacteristicFormInput>({
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(characteristicsFormSchema),
  })
  const fields = getCharacterCharacteristics(character)
  const isPending = mutation.isPending || form.formState.isSubmitting

  useEffect(() => {
    if (open) form.reset(defaultValues)
  }, [defaultValues, form, open])

  async function handleSubmit(values: CharacteristicFormInput) {
    const input = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [
        key,
        value === "" ? null : Number(value),
      ]),
    ) as UpdateCharacterCharacteristicsDto

    try {
      await mutation.mutateAsync(input)
      onOpenChange(false)
    } catch {
      toast.error(
        localizedContent.copy
          .characterDetailHeaderCharacterCharacteristicsEditorDialog
          .neUdalosSohranitHarakteristiki,
      )
    }
  }

  function closeModal() {
    if (!isPending) onOpenChange(false)
  }

  return (
    <Dialog
      onOpenChange={(nextOpen) => {
        if (!isPending) onOpenChange(nextOpen)
      }}
      open={open}
    >
      <DialogContent
        className="border border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel)] text-[var(--ml-ink-primary)] shadow-2xl sm:max-w-md"
        showCloseButton={false}
      >
        <DialogHeader className="pr-9">
          <DialogTitle className="text-2xl">
            {
              localizedContent.copy
                .characterDetailHeaderCharacterCharacteristicsEditorDialog
                .izmenitHarakteristiki
            }
          </DialogTitle>
          <DialogDescription>
            {
              localizedContent.copy
                .characterDetailHeaderCharacterCharacteristicsEditorDialog
                .pustoePoleSohranitsyaKakNeukazannoeZnachenie
            }
          </DialogDescription>
        </DialogHeader>
        <DialogClose asChild>
          <Button
            aria-label={
              localizedContent.copy
                .characterDetailHeaderCharacterCharacteristicsEditorDialog
                .zakrytOknoIzmeneniyaHarakteristik
            }
            className="absolute top-2 right-2"
            disabled={isPending}
            onClick={closeModal}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <X aria-hidden="true" />
          </Button>
        </DialogClose>

        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid grid-cols-2 gap-3">
            {fields.map((field) => (
              <CharacteristicInput
                control={form.control}
                disabled={isPending}
                key={field.key}
                label={field.title ?? field.label}
                name={field.key}
              />
            ))}
          </div>
          <DialogFooter className="mt-5 sm:justify-stretch">
            <Button
              className="w-full sm:flex-1"
              disabled={isPending}
              onClick={closeModal}
              type="button"
              variant="destructive"
            >
              {
                localizedContent.copy
                  .characterDetailHeaderCharacterCharacteristicsEditorDialog
                  .otmena
              }
            </Button>
            <Button
              className="w-full sm:flex-1"
              disabled={isPending}
              type="submit"
              variant="success"
            >
              {isPending
                ? localizedContent.copy
                    .characterDetailHeaderCharacterCharacteristicsEditorDialog
                    .sohranenie
                : localizedContent.copy
                    .characterDetailHeaderCharacterCharacteristicsEditorDialog
                    .sohranit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
