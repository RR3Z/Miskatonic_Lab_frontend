"use client"

import { useId } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { Field } from "@/components/ui/field/field"
import { FieldLabel } from "@/components/ui/field/field-label"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select/select"
import { SelectContent } from "@/components/ui/select/select-content"
import { SelectItem } from "@/components/ui/select/select-item"
import { SelectTrigger } from "@/components/ui/select/select-trigger"
import { SelectValue } from "@/components/ui/select/select-value"
import localizedContent from "@/data/locales/ru/character/create.ru.json"
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
            <FieldLabel htmlFor={nameId}>
              {
                localizedContent.copy
                  .componentsCharacterCreateCharacterIdentityFields.imya
              }
            </FieldLabel>
            <Input
              {...field}
              aria-invalid={fieldState.invalid}
              disabled={disabled}
              id={nameId}
              maxLength={MAX_CHARACTER_NAME_LENGTH}
              placeholder={
                localizedContent.copy
                  .componentsCharacterCreateCharacterIdentityFields
                  .naprimerHarviUolters
              }
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
              <FieldLabel htmlFor={sexId}>
                {
                  localizedContent.copy
                    .componentsCharacterCreateCharacterIdentityFields.pol
                }
              </FieldLabel>
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
                  className="w-full"
                  id={sexId}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unspecified">
                    {
                      localizedContent.copy
                        .componentsCharacterCreateCharacterIdentityFields
                        .neUkazan
                    }
                  </SelectItem>
                  <SelectItem value="male">
                    {
                      localizedContent.copy
                        .componentsCharacterCreateCharacterIdentityFields
                        .muzhchina
                    }
                  </SelectItem>
                  <SelectItem value="female">
                    {
                      localizedContent.copy
                        .componentsCharacterCreateCharacterIdentityFields
                        .zhenschina
                    }
                  </SelectItem>
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
              <FieldLabel htmlFor={ageId}>
                {
                  localizedContent.copy
                    .componentsCharacterCreateCharacterIdentityFields.vozrast
                }
              </FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                disabled={disabled}
                id={ageId}
                min={0}
                placeholder={
                  localizedContent.copy
                    .componentsCharacterCreateCharacterIdentityFields.naprimer42
                }
                type="number"
              />
            </Field>
          )}
        />
      </div>
    </>
  )
}
