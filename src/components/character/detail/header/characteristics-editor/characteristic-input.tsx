import { useId } from "react"
import { type Control, Controller } from "react-hook-form"

import { Field } from "@/components/ui/field/field"
import { FieldError } from "@/components/ui/field/field-error"
import { FieldLabel } from "@/components/ui/field/field-label"
import { Input } from "@/components/ui/input"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"
import {
  MAX_CHARACTERISTIC_VALUE,
  type UpdateCharacterCharacteristicsDto,
} from "@/dto/character/character-sheet-values.dto"

import type { CharacteristicFormInput } from "./types/characteristics-editor.types"

type CharacteristicInputProps = {
  control: Control<CharacteristicFormInput>
  disabled: boolean
  label: string
  name: keyof UpdateCharacterCharacteristicsDto
}

export function CharacteristicInput({
  control,
  disabled,
  label,
  name,
}: CharacteristicInputProps) {
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
            placeholder={localizedContent.copy.characterDetailCommon.emptyValue}
          />
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  )
}
