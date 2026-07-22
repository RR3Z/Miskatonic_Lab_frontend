import { Minus, Plus } from "lucide-react"
import { Field } from "@/components/ui/field/field"
import { FieldLabel } from "@/components/ui/field/field-label"
import { Input } from "@/components/ui/input"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"
import { formatLocalizedTemplate } from "@/data/locales/utils/format-localized-template.util"

import { ResourceAdjustButton } from "./resource-adjust-button"

type ResourceValueInputProps = {
  decrementDisabled: boolean
  disabled: boolean
  id: string
  incrementDisabled: boolean
  label: string
  onChange: (value: string) => void
  onDecrement: () => void
  onIncrement: () => void
  value: string
}

export function ResourceValueInput({
  decrementDisabled,
  disabled,
  id,
  incrementDisabled,
  label,
  onChange,
  onDecrement,
  onIncrement,
  value,
}: ResourceValueInputProps) {
  const valueName =
    label ===
    localizedContent.copy.detailHeaderResourceStatResourceValueInput.tekuschee
      ? localizedContent.copy.detailHeaderResourceStatResourceValueInput
          .tekuscheeZnachenieResursa
      : localizedContent.copy.detailHeaderResourceStatResourceValueInput
          .maksimalnoeZnachenieResursa
  return (
    <Field>
      <FieldLabel
        className="w-full justify-center text-center font-heading text-base font-semibold"
        htmlFor={id}
      >
        {label}
      </FieldLabel>
      <div className="flex items-center gap-1">
        <ResourceAdjustButton
          aria-label={formatLocalizedTemplate(
            localizedContent.copy.detailHeaderResourceStatResourceValueInput
              .umenshitValue0,
            { value0: valueName },
          )}
          disabled={decrementDisabled}
          onClick={onDecrement}
        >
          <Minus aria-hidden="true" />
        </ResourceAdjustButton>
        <Input
          aria-label={valueName[0]?.toUpperCase() + valueName.slice(1)}
          align="center"
          disabled={disabled}
          id={id}
          inputMode="numeric"
          maxLength={3}
          onChange={(event) => onChange(event.target.value.replace(/\D/g, ""))}
          pattern="[0-9]*"
          value={value}
          variant="accent"
        />
        <ResourceAdjustButton
          aria-label={formatLocalizedTemplate(
            localizedContent.copy.detailHeaderResourceStatResourceValueInput
              .uvelichitValue0,
            { value0: valueName },
          )}
          disabled={incrementDisabled}
          onClick={onIncrement}
        >
          <Plus aria-hidden="true" />
        </ResourceAdjustButton>
      </div>
    </Field>
  )
}
