"use client"

import { useEffect, useId, useMemo, useState } from "react"
import { getEditableSkillValues } from "@/components/character/detail/skills/utils/skill-values.util"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DialogFooter } from "@/components/ui/dialog/dialog-footer"
import { Input } from "@/components/ui/input"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"
import type { CharacterSkillInput } from "@/lib/api/character-skills"

export function CharacterSkillForm({
  canEditDefinition = true,
  initialValue,
  isPending,
  onCancel,
  onSubmit,
  submitLabel,
}: {
  canEditDefinition?: boolean
  initialValue: CharacterSkillInput
  isPending: boolean
  onCancel: () => void
  onSubmit: (input: CharacterSkillInput) => Promise<unknown>
  submitLabel: string
}) {
  const baseValueId = useId()
  const valueId = useId()
  const checkedId = useId()
  const normalizedInitialValue = useMemo(
    () => getEditableSkillValues(initialValue.base_value, initialValue.value),
    [initialValue.base_value, initialValue.value],
  )
  const [name, setName] = useState(initialValue.name)
  const [baseValue, setBaseValue] = useState(
    String(normalizedInitialValue.baseValue),
  )
  const [value, setValue] = useState(String(normalizedInitialValue.value))
  const [checked, setChecked] = useState(initialValue.checked)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setName(initialValue.name)
    setBaseValue(String(normalizedInitialValue.baseValue))
    setValue(String(normalizedInitialValue.value))
    setChecked(initialValue.checked)
    setError(null)
  }, [initialValue, normalizedInitialValue])

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const parsedBaseValue = Number(baseValue)
    const parsedValue = Number(value)
    if (
      !name.trim() ||
      !Number.isInteger(parsedBaseValue) ||
      !Number.isInteger(parsedValue) ||
      parsedBaseValue < 0 ||
      parsedValue < 0
    ) {
      setError(
        localizedContent.copy.characterDetailSkillsCharacterSkillForm
          .vvediteNazvanieITselyeNeotritsatelnyeZnacheniya,
      )
      return
    }

    if (parsedBaseValue > 100 || parsedBaseValue + parsedValue > 100) {
      setError(
        localizedContent.copy.characterDetailSkillsCharacterSkillForm
          .itogovoeZnachenieNavykaNeMozhetPrevyshat,
      )
      return
    }

    setError(null)
    try {
      await onSubmit({
        name: canEditDefinition ? name.trim() : initialValue.name,
        base_value: canEditDefinition
          ? parsedBaseValue
          : initialValue.base_value,
        value: parsedValue,
        checked,
      })
    } catch {
      setError(
        localizedContent.copy.characterDetailSkillsCharacterSkillForm
          .neUdalosSohranitNavyk,
      )
    }
  }

  const draftBaseValue = Number(baseValue)
  const draftValue = Number(value)
  const isAtMaximum =
    Number.isFinite(draftBaseValue) &&
    Number.isFinite(draftValue) &&
    draftBaseValue + draftValue >= 100

  return (
    <form
      className="grid gap-4"
      data-testid="character-skill-form"
      onSubmit={submit}
    >
      {canEditDefinition ? (
        <Input
          aria-label={
            localizedContent.copy.characterDetailSkillsCharacterSkillForm
              .nazvanieNavyka
          }
          disabled={isPending}
          maxLength={100}
          onChange={(event) => setName(event.target.value)}
          placeholder={
            localizedContent.copy.characterDetailSkillsCharacterSkillForm
              .nazvanieNavyka
          }
          value={name}
        />
      ) : null}
      <div className="grid grid-cols-[1fr_1fr_auto] items-end gap-2">
        <label
          className="grid gap-1 font-body text-xs text-[var(--ml-ink-muted)]"
          htmlFor={baseValueId}
        >
          {localizedContent.copy.characterDetailSkillsCharacterSkillForm.baza}
          <Input
            aria-label={
              localizedContent.copy.characterDetailSkillsCharacterSkillForm
                .bazovoeZnachenieNavyka
            }
            disabled={isPending || !canEditDefinition}
            id={baseValueId}
            min={0}
            max={100}
            onChange={(event) => setBaseValue(event.target.value)}
            type="number"
            value={baseValue}
          />
        </label>
        <label
          className="grid gap-1 font-body text-xs text-[var(--ml-ink-muted)]"
          htmlFor={valueId}
        >
          {
            localizedContent.copy.characterDetailSkillsCharacterSkillForm
              .prokachka
          }
          <Input
            aria-label={
              localizedContent.copy.characterDetailSkillsCharacterSkillForm
                .prokachkaNavyka
            }
            disabled={isPending}
            id={valueId}
            min={0}
            max={Math.max(
              0,
              100 - Math.min(Math.max(Number(baseValue) || 0, 0), 100),
            )}
            onChange={(event) => setValue(event.target.value)}
            type="number"
            value={value}
          />
        </label>
        <label
          className="flex h-9 cursor-pointer items-center gap-2 font-body text-xs text-[var(--ml-ink-muted)] has-[:disabled]:cursor-not-allowed"
          htmlFor={checkedId}
        >
          <Checkbox
            aria-label={
              localizedContent.copy.characterDetailSkillsCharacterSkillForm
                .otmechenDlyaRazvitiya
            }
            checked={checked}
            disabled={isPending || isAtMaximum}
            id={checkedId}
            onCheckedChange={(nextChecked) => setChecked(nextChecked === true)}
          />
          {
            localizedContent.copy.characterDetailSkillsCharacterSkillForm
              .razvitie
          }
        </label>
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
      <DialogFooter className="mt-1 sm:justify-stretch">
        <Button
          className="w-full sm:flex-1"
          disabled={isPending}
          onClick={onCancel}
          type="button"
          variant="destructive"
        >
          {localizedContent.copy.characterDetailSkillsCharacterSkillForm.otmena}
        </Button>
        <Button
          className="w-full sm:flex-1"
          disabled={isPending}
          type="submit"
          variant="success"
        >
          {isPending
            ? localizedContent.copy.characterDetailSkillsCharacterSkillForm
                .sohranenie
            : submitLabel}
        </Button>
      </DialogFooter>
    </form>
  )
}
