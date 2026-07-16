"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"
import { useEffect, useId, useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { getCharacterCharacteristics } from "@/components/character/detail/header/character-characteristic-definitions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  characterNullableIntegerTextSchema,
  MAX_CHARACTERISTIC_VALUE,
  type UpdateCharacterCharacteristicsDto,
} from "@/dto/character/character-sheet-values.dto"
import { useUpdateCharacterCharacteristics } from "@/lib/api/use-character-statistics"
import type { CharacterDetail } from "@/types/character"

type CharacteristicFormInput = Record<
  keyof UpdateCharacterCharacteristicsDto,
  string
>

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
  const defaultValues = useMemo(() => getFormValues(character), [character])
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
      toast.error("Не удалось сохранить характеристики")
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
            Изменить характеристики
          </DialogTitle>
          <DialogDescription>
            Пустое поле сохранится как неуказанное значение.
          </DialogDescription>
        </DialogHeader>
        <DialogClose asChild>
          <Button
            aria-label="Закрыть окно изменения характеристик"
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
              Отмена
            </Button>
            <Button
              className="w-full sm:flex-1"
              disabled={isPending}
              type="submit"
              variant="success"
            >
              {isPending ? "Сохранение…" : "Сохранить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function CharacteristicInput({
  control,
  disabled,
  label,
  name,
}: {
  control: ReturnType<typeof useForm<CharacteristicFormInput>>["control"]
  disabled: boolean
  label: string
  name: keyof UpdateCharacterCharacteristicsDto
}) {
  const id = useId()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <Input
            {...field}
            aria-invalid={fieldState.invalid}
            disabled={disabled}
            id={id}
            inputMode="numeric"
            maxLength={3}
            onChange={(event) => {
              const digits = event.target.value.replace(/\D/g, "")
              field.onChange(
                digits === ""
                  ? ""
                  : String(Math.min(Number(digits), MAX_CHARACTERISTIC_VALUE)),
              )
            }}
            pattern="[0-9]*"
            placeholder="—"
          />
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  )
}

function getFormValues(character: CharacterDetail): CharacteristicFormInput {
  return Object.fromEntries(
    getCharacterCharacteristics(character).map((field) => [
      field.key,
      field.value === null ? "" : String(field.value),
    ]),
  ) as CharacteristicFormInput
}
