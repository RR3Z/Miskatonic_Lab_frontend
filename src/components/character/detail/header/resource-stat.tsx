"use client"

import { X } from "lucide-react"
import Image from "next/image"
import { useEffect, useId, useState } from "react"
import { toast } from "sonner"
import { characterStatVisuals } from "@/components/character/constants/character-stat-visuals.constants"
import { ResourceCalculatorActions } from "@/components/character/detail/header/resource-calculator-actions"
import { ResourceDialogBackground } from "@/components/character/detail/header/resource-stat/resource-dialog-background"
import { ResourceValueInput } from "@/components/character/detail/header/resource-stat/resource-value-input"
import {
  adjustDraftValue,
  getResourceValidationMessage,
  parseResourceValue,
} from "@/components/character/detail/header/resource-stat/utils/resource-stat.util"
import { CHARACTER_RESOURCE_TONE_CLASSES } from "@/components/character/detail/header/styles/character-resource-tone.styles"
import type { ResourceStatDefinition } from "@/components/character/detail/header/types/character-stat.types"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog/dialog"
import { DialogClose } from "@/components/ui/dialog/dialog-close"
import { DialogContent } from "@/components/ui/dialog/dialog-content"
import { DialogFooter } from "@/components/ui/dialog/dialog-footer"
import { DialogHeader } from "@/components/ui/dialog/dialog-header"
import { DialogTitle } from "@/components/ui/dialog/dialog-title"
import { FieldError } from "@/components/ui/field/field-error"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"
import { formatLocalizedTemplate } from "@/data/locales/utils/format-localized-template.util"
import type { CharacterDiceRoll } from "@/lib/api/character-dice-rolls"
import { cn } from "@/lib/utils/cn.util"
import type { CharacterDetail } from "@/types/character.types"

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
  const validationMessage = getResourceValidationMessage(
    parsedCurrent,
    parsedMax,
  )

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
      toast.error(
        formatLocalizedTemplate(
          localizedContent.copy.characterDetailHeaderResourceStat
            .neUdalosSohranitResursValue0,
          { value0: label },
        ),
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <Button
        aria-haspopup="dialog"
        aria-label={formatLocalizedTemplate(
          localizedContent.copy.characterDetailHeaderResourceStat
            .izmenitResursValue0,
          { value0: label },
        )}
        className={cn(
          "relative flex min-h-13 min-w-0 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-md border bg-[var(--ml-surface-panel-raised)]/75 px-2 py-1 text-center transition-colors hover:bg-[var(--ml-surface-panel-raised)] focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-[var(--ml-focus-ring)]",
          CHARACTER_RESOURCE_TONE_CLASSES[tone],
        )}
        data-resource={resource}
        data-testid="character-resource"
        onClick={() => setOpen(true)}
        size="content"
        type="button"
        variant="unstyled"
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
      </Button>

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
                aria-label={
                  localizedContent.copy.characterDetailHeaderResourceStat
                    .zakrytKalkulyatorResursa
                }
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
              {formatLocalizedTemplate(
                localizedContent.copy.characterDetailHeaderResourceStat
                  .izmenitResursTitleValue0,
                { value0: label },
              )}
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
              label={
                localizedContent.copy.characterDetailHeaderResourceStat
                  .tekuschee
              }
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
              label={
                localizedContent.copy.characterDetailHeaderResourceStat.maksimum
              }
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
              <p className="font-semibold">
                {
                  localizedContent.copy.characterDetailHeaderResourceStat
                    .napominaniyaPosleSohraneniya
                }
              </p>
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
              {localizedContent.copy.characterDetailHeaderResourceStat.otmena}
            </Button>
            <Button
              className="w-full sm:flex-1"
              disabled={Boolean(validationMessage) || isSaving}
              onClick={() => void saveDraft()}
              type="button"
              variant="success"
            >
              {isSaving
                ? localizedContent.copy.characterDetailHeaderResourceStat
                    .sohranenie
                : localizedContent.copy.characterDetailHeaderResourceStat
                    .sohranit}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
