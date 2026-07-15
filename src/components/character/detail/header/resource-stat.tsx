"use client"

import { Minus, Plus, X } from "lucide-react"
import Image from "next/image"
import type * as React from "react"
import { useEffect, useId, useState } from "react"
import { toast } from "sonner"

import { characterStatVisuals } from "@/components/character/character-stat-visuals"
import { CHARACTER_RESOURCE_TONE_CLASSES } from "@/components/character/detail/header/character-resource-tone-classes"
import type { ResourceStatDefinition } from "@/components/character/detail/header/character-stat-types"
import { ResourceCalculatorActions } from "@/components/character/detail/header/resource-calculator-actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { CharacterDiceRoll } from "@/lib/api/character-dice-rolls"
import { cn } from "@/lib/utils/cn.util"
import type { CharacterDetail } from "@/types/character"

export function ResourceStat({
  character,
  current,
  isRolling,
  label,
  max,
  onRoll,
  onSave,
  resource,
  tone,
  visualKey,
}: ResourceStatDefinition & {
  character: CharacterDetail
  isRolling: boolean
  onRoll: (expression: string) => Promise<CharacterDiceRoll>
  onSave: (current: number, max: number) => Promise<unknown>
}) {
  const [open, setOpen] = useState(false)
  const [draftCurrent, setDraftCurrent] = useState(String(current))
  const [draftMax, setDraftMax] = useState(String(max))
  const [isSaving, setIsSaving] = useState(false)
  const [reminders, setReminders] = useState<string[]>([])
  const visual = characterStatVisuals[visualKey]
  const Icon = visual.icon
  const currentId = useId()
  const maxId = useId()
  const parsedCurrent = parseResourceValue(draftCurrent)
  const parsedMax = parseResourceValue(draftMax)
  const validationMessage = getValidationMessage(parsedCurrent, parsedMax)

  useEffect(() => {
    if (!open) return
    setDraftCurrent(String(current))
    setDraftMax(String(max))
    setReminders([])
  }, [current, max, open])

  function addReminder(message: string) {
    setReminders((currentReminders) =>
      currentReminders.includes(message)
        ? currentReminders
        : [...currentReminders, message],
    )
  }

  async function saveDraft() {
    if (validationMessage || parsedCurrent === null || parsedMax === null) {
      return
    }

    setIsSaving(true)
    try {
      await onSave(parsedCurrent, parsedMax)
      for (const reminder of reminders) toast(reminder)
      setOpen(false)
    } catch {
      toast.error(`Не удалось сохранить ресурс «${label}»`)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <button
        aria-haspopup="dialog"
        aria-label={`Изменить ресурс ${label}`}
        className={cn(
          "relative flex min-h-13 min-w-0 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-md border bg-[var(--ml-surface-panel-raised)]/75 px-2 py-1 text-center transition-colors hover:bg-[var(--ml-surface-panel-raised)] focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-[var(--ml-focus-ring)]",
          CHARACTER_RESOURCE_TONE_CLASSES[tone],
        )}
        data-resource={resource}
        data-testid="character-resource"
        onClick={() => setOpen(true)}
        type="button"
      >
        {visual.image ? (
          <Image
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute size-14 opacity-[0.32]"
            data-testid="character-resource-icon"
            height={56}
            src={visual.image}
            style={
              visual.imageFilter ? { filter: visual.imageFilter } : undefined
            }
            width={56}
          />
        ) : Icon ? (
          <Icon
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute size-14 opacity-[0.32]",
              visual.iconClassName,
            )}
            data-testid="character-resource-icon"
          />
        ) : null}
        <span className="relative z-10 block font-body text-[0.6rem] uppercase tracking-[0.12em] text-[var(--ml-ink-muted)]">
          {label}
        </span>
        <span className="relative z-10 font-mono text-base font-semibold tabular-nums">
          {current}/{max}
        </span>
      </button>

      <Dialog
        onOpenChange={(nextOpen) => !isSaving && setOpen(nextOpen)}
        open={open}
      >
        <DialogContent
          className="max-h-[calc(100dvh-2rem)] overflow-x-hidden overflow-y-auto border border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel)] text-[var(--ml-ink-primary)] shadow-2xl sm:max-w-md"
          showCloseButton={false}
        >
          <ResourceDialogBackground visual={visual} />
          {!isSaving ? (
            <DialogClose asChild>
              <Button
                aria-label="Закрыть калькулятор ресурса"
                className="absolute top-2 right-2 z-20"
                size="icon-sm"
                type="button"
                variant="ghost"
              >
                <X aria-hidden="true" />
              </Button>
            </DialogClose>
          ) : null}
          <DialogHeader className="relative z-10 items-center border-b border-[var(--ml-border-subtle)] pb-3 text-center">
            <DialogTitle className="font-heading text-xl font-semibold tracking-wide">
              Изменить ресурс: {label}
            </DialogTitle>
          </DialogHeader>

          <div className="relative z-10 grid grid-cols-2 gap-3">
            <ResourceValueInput
              decrementDisabled={
                isSaving || parsedCurrent === null || parsedCurrent === 0
              }
              disabled={isSaving}
              id={currentId}
              incrementDisabled={
                isSaving ||
                parsedCurrent === null ||
                parsedMax === null ||
                parsedCurrent >= parsedMax
              }
              label="Текущее"
              onChange={setDraftCurrent}
              onDecrement={() =>
                adjustDraftValue(setDraftCurrent, parsedCurrent, -1)
              }
              onIncrement={() =>
                adjustDraftValue(setDraftCurrent, parsedCurrent, 1)
              }
              value={draftCurrent}
            />
            <ResourceValueInput
              decrementDisabled={
                isSaving ||
                parsedCurrent === null ||
                parsedMax === null ||
                parsedMax <= parsedCurrent
              }
              disabled={isSaving}
              id={maxId}
              incrementDisabled={
                isSaving || parsedMax === null || parsedMax === 100
              }
              label="Максимум"
              onChange={setDraftMax}
              onDecrement={() => adjustDraftValue(setDraftMax, parsedMax, -1)}
              onIncrement={() => adjustDraftValue(setDraftMax, parsedMax, 1)}
              value={draftMax}
            />
          </div>
          <FieldError
            className="relative z-10 rounded-sm border border-[var(--ml-accent-danger)]/75 bg-[color-mix(in_srgb,var(--ml-accent-danger)_18%,var(--ml-surface-panel))] px-2 py-1.5 font-medium text-[#f2a29e] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
            errors={validationMessage ? [{ message: validationMessage }] : []}
          />
          <ResourceCalculatorActions
            constitution={character.characteristics.constitution}
            current={parsedCurrent}
            intelligence={character.characteristics.intelligence}
            isRolling={isRolling}
            majorWound={character.hp.major_wound}
            max={parsedMax}
            onCurrentChange={(value) => setDraftCurrent(String(value))}
            onReminder={addReminder}
            onRoll={onRoll}
            power={character.characteristics.power}
            resource={resource}
          />
          {reminders.length ? (
            <div className="relative z-10 rounded-sm border border-[var(--ml-accent-warning)]/65 bg-[var(--ml-surface-panel-raised)]/90 px-2 py-2 text-sm text-[var(--ml-ink-primary)]">
              <p className="font-semibold">Напоминания после сохранения</p>
              <ul className="mt-1 list-disc space-y-1 pl-4 text-[var(--ml-ink-muted)]">
                {reminders.map((reminder) => (
                  <li key={reminder}>{reminder}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <DialogFooter className="relative z-10 mt-2 sm:justify-stretch">
            <Button
              className="w-full sm:flex-1"
              disabled={isSaving}
              onClick={() => setOpen(false)}
              type="button"
              variant="destructive"
            >
              Отмена
            </Button>
            <Button
              className="w-full sm:flex-1"
              disabled={Boolean(validationMessage) || isSaving}
              onClick={() => void saveDraft()}
              type="button"
              variant="success"
            >
              {isSaving ? "Сохранение…" : "Сохранить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function ResourceValueInput({
  decrementDisabled,
  disabled,
  id,
  incrementDisabled,
  label,
  onChange,
  onDecrement,
  onIncrement,
  value,
}: {
  decrementDisabled: boolean
  disabled: boolean
  id: string
  incrementDisabled: boolean
  label: string
  onChange: (value: string) => void
  onDecrement: () => void
  onIncrement: () => void
  value: string
}) {
  const valueName =
    label === "Текущее"
      ? "текущее значение ресурса"
      : "максимальное значение ресурса"

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
          aria-label={`Уменьшить ${valueName}`}
          disabled={decrementDisabled}
          onClick={onDecrement}
        >
          <Minus aria-hidden="true" />
        </ResourceAdjustButton>
        <Input
          aria-label={valueName[0]?.toUpperCase() + valueName.slice(1)}
          className="bg-[color-mix(in_srgb,var(--ml-bg-page)_88%,black)] text-center font-mono tabular-nums"
          disabled={disabled}
          id={id}
          inputMode="numeric"
          maxLength={3}
          onChange={(event) => onChange(event.target.value.replace(/\D/g, ""))}
          pattern="[0-9]*"
          value={value}
        />
        <ResourceAdjustButton
          aria-label={`Увеличить ${valueName}`}
          disabled={incrementDisabled}
          onClick={onIncrement}
        >
          <Plus aria-hidden="true" />
        </ResourceAdjustButton>
      </div>
    </Field>
  )
}

function ResourceAdjustButton({
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      className="border border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel-raised)] text-[var(--ml-ink-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-[var(--ml-accent-brass-strong)] hover:bg-[var(--ml-surface-panel)] hover:text-[var(--ml-accent-aged-gold)] disabled:border-[var(--ml-border-subtle)] disabled:bg-transparent disabled:text-[var(--ml-ink-muted)] disabled:opacity-30"
      size="icon-xs"
      type="button"
      variant="ghost"
    >
      {children}
    </Button>
  )
}

function ResourceDialogBackground({
  visual,
}: {
  visual: (typeof characterStatVisuals)[keyof typeof characterStatVisuals]
}) {
  const Icon = visual.icon

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 grid place-items-center opacity-[0.12]"
      data-testid="resource-dialog-icon"
    >
      {visual.image ? (
        <Image
          alt=""
          className="size-48"
          height={192}
          src={visual.image}
          style={
            visual.imageFilter ? { filter: visual.imageFilter } : undefined
          }
          width={192}
        />
      ) : Icon ? (
        <Icon className={cn("size-48", visual.iconClassName)} />
      ) : null}
    </div>
  )
}

function adjustDraftValue(
  setValue: (value: string) => void,
  value: number | null,
  delta: -1 | 1,
) {
  if (value === null) return
  setValue(String(value + delta))
}

function parseResourceValue(value: string): number | null {
  if (!/^\d+$/.test(value)) return null
  const parsed = Number(value)
  return Number.isSafeInteger(parsed) && parsed <= 100 ? parsed : null
}

function getValidationMessage(
  current: number | null,
  max: number | null,
): string | null {
  if (current === null || max === null) {
    return "Введите целое неотрицательное значение от 0 до 100"
  }
  if (current > max) {
    return "Текущее значение не может быть больше максимального"
  }
  return null
}
