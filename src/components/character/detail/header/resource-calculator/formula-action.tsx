import { Field } from "@/components/ui/field/field"
import { FieldLabel } from "@/components/ui/field/field-label"
import { Input } from "@/components/ui/input"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"

import { RuleButton } from "./rule-button"

type FormulaActionProps = {
  disabled: boolean
  formula: string
  label: string
  onFormulaChange: (value: string) => void
  onRoll: () => void
}

export function FormulaAction({
  disabled,
  formula,
  label,
  onFormulaChange,
  onRoll,
}: FormulaActionProps) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-2">
      <Field>
        <FieldLabel
          className="text-xs uppercase tracking-[0.08em] text-[var(--ml-ink-muted)]"
          htmlFor={`${label}-formula`}
        >
          {label}
        </FieldLabel>
        <Input
          id={`${label}-formula`}
          onChange={(event) => onFormulaChange(event.target.value)}
          value={formula}
          variant="accent"
        />
      </Field>
      <RuleButton disabled={disabled || !formula.trim()} onClick={onRoll}>
        {
          localizedContent.copy.detailHeaderResourceCalculatorFormulaAction
            .brosit
        }
      </RuleButton>
    </div>
  )
}
