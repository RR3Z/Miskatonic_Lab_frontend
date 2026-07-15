"use client"

import { useId } from "react"
import { Controller, useFormContext } from "react-hook-form"

import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  type CreateCharacterFormDto,
  type CreateCharacterFormInput,
  MAX_CHARACTER_NAME_LENGTH,
} from "@/dto/character/create-character.dto"

type CharacterIdentityFieldsProps = {
  disabled: boolean
}

export function CharacterIdentityFields({
  disabled,
}: CharacterIdentityFieldsProps) {
  const nameId = useId()
  const sexId = useId()
  const ageId = useId()
  const form = useFormContext<
    CreateCharacterFormInput,
    undefined,
    CreateCharacterFormDto
  >()

  return (
    <>
      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={nameId}>Имя</FieldLabel>
            <Input
              {...field}
              aria-invalid={fieldState.invalid}
              className="bg-[var(--ml-surface-panel-raised)]"
              disabled={disabled}
              id={nameId}
              maxLength={MAX_CHARACTER_NAME_LENGTH}
              placeholder="Например, Харви Уолтерс"
              required
            />
          </Field>
        )}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          control={form.control}
          name="sex"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={sexId}>Пол</FieldLabel>
              <Select
                disabled={disabled}
                name={field.name}
                onValueChange={(value) =>
                  field.onChange(value === "unspecified" ? "" : value)
                }
                value={field.value || "unspecified"}
              >
                <SelectTrigger
                  aria-invalid={fieldState.invalid}
                  className="w-full bg-[var(--ml-surface-panel-raised)]"
                  id={sexId}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unspecified">Не указан</SelectItem>
                  <SelectItem value="male">Мужчина</SelectItem>
                  <SelectItem value="female">Женщина</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="age"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={ageId}>Возраст</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                className="bg-[var(--ml-surface-panel-raised)]"
                disabled={disabled}
                id={ageId}
                min={0}
                placeholder="Например, 42"
                type="number"
              />
            </Field>
          )}
        />
      </div>
    </>
  )
}
