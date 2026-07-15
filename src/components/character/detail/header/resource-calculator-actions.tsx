"use client"

import { Info } from "lucide-react"
import type * as React from "react"
import type { CSSProperties } from "react"
import { useState } from "react"
import { toast } from "sonner"
import {
  DiceRollResultToast,
  FormulaDiceRollResultToast,
  getDiceRollToastClassName,
  getDiceRollToastCloseButtonClassName,
  getDiceRollToastStyle,
} from "@/components/character/detail/header/dice-roll-result-toast"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  DICE_RESULT_TOASTER_ID,
  TOAST_DURATION_MS,
} from "@/components/ui/sonner"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { CharacterResourceKey } from "@/dto/character/character-sheet-values.dto"
import type { CharacterDiceRoll } from "@/lib/api/character-dice-rolls"
import { classifyCharacteristicCheck } from "@/lib/dice/characteristic-check"

type ResourceCalculatorActionsProps = {
  constitution: number | null
  current: number | null
  intelligence: number | null
  isRolling: boolean
  majorWound: boolean
  max: number | null
  onCurrentChange: (value: number) => void
  onReminder: (message: string) => void
  onRoll: (expression: string) => Promise<CharacterDiceRoll>
  power: number | null
  resource: CharacterResourceKey
}

export function ResourceCalculatorActions({
  constitution,
  current,
  intelligence,
  isRolling,
  majorWound,
  max,
  onCurrentChange,
  onReminder,
  onRoll,
  power,
  resource,
}: ResourceCalculatorActionsProps) {
  const [formula, setFormula] = useState("1d3")
  const canChangeCurrent = current !== null && max !== null

  function changeCurrent(delta: number) {
    if (current === null || max === null) return
    onCurrentChange(Math.min(max, Math.max(0, current + delta)))
  }

  async function rollFormula(title: string, apply: (result: number) => void) {
    await rollExpression(formula, title, apply)
  }

  async function rollExpression(
    expression: string,
    title: string,
    apply: (result: number) => void,
  ) {
    const trimmedExpression = expression.trim()
    if (!trimmedExpression) return

    try {
      const roll = await onRoll(trimmedExpression)
      toast(
        <FormulaDiceRollResultToast
          formula={roll.expression || trimmedExpression}
          result={roll.result}
          title={title}
        />,
        {
          classNames: {
            closeButton: "bg-[#29251d]! text-[#ead99b]! hover:bg-[#383120]!",
            content: "h-full! w-full! gap-0!",
            title: "h-full! w-full!",
            toast:
              "dice-roll-toast min-h-24! items-stretch! border-2! border-[#b6a367]! bg-[linear-gradient(135deg,#3a3221,#211d18)]! p-3! text-[var(--ml-ink-primary)]! shadow-[0_20px_48px_rgba(0,0,0,0.72)]!",
          },
          duration: TOAST_DURATION_MS,
          style: { "--dice-roll-border-color": "#b6a367" } as CSSProperties,
          toasterId: DICE_RESULT_TOASTER_ID,
        },
      )
      apply(roll.result)
    } catch {
      toast.error("Не удалось выполнить бросок")
    }
  }

  async function rollCheck(
    characteristic: number | null,
    title: string,
    onOutcome: (success: boolean) => void,
  ) {
    if (characteristic === null) return

    try {
      const roll = await onRoll("1d100")
      const check = classifyCharacteristicCheck(characteristic, roll.result)
      const success = check.outcome !== "failure" && check.outcome !== "fumble"
      toast(
        <DiceRollResultToast
          outcome={check.outcome}
          result={roll.result}
          title={title}
        />,
        {
          classNames: {
            closeButton: getDiceRollToastCloseButtonClassName(check.outcome),
            content: "h-full! w-full! gap-0!",
            title: "h-full! w-full!",
            toast: `dice-roll-toast min-h-24! items-stretch! border-2! p-3! text-[var(--ml-ink-primary)]! ${getDiceRollToastClassName(check.outcome)}`,
          },
          duration: TOAST_DURATION_MS,
          style: getDiceRollToastStyle(check.outcome),
          toasterId: DICE_RESULT_TOASTER_ID,
        },
      )
      onOutcome(success)
    } catch {
      toast.error("Не удалось выполнить бросок")
    }
  }

  return (
    <TooltipProvider delayDuration={200}>
      <section
        className="relative z-10 mt-1 grid gap-3"
        data-testid="resource-calculator-actions"
      >
        {resource === "hp" ? (
          <div className="grid gap-3">
            <CalculatorActionGroup title="Урон">
              <FormulaAction
                disabled={!canChangeCurrent || isRolling}
                formula={formula}
                label="Формула броска"
                onFormulaChange={setFormula}
                onRoll={() =>
                  rollFormula("Урон", (damage) => {
                    changeCurrent(-damage)
                    if (max !== null && damage > max) {
                      onReminder(
                        "Урон превышает максимум здоровья: отметьте «Мёртв».",
                      )
                    } else if (max !== null && damage >= max / 2) {
                      onReminder(
                        "Урон не меньше половины максимального здоровья: отметьте «Серьёзная рана».",
                      )
                    }
                    if (current !== null && current - damage <= 0) {
                      onReminder(
                        "Здоровье опустилось до 0: отметьте «Без сознания».",
                      )
                      if (majorWound || (max !== null && damage >= max / 2)) {
                        onReminder(
                          "0 здоровья при серьёзной ране: отметьте «При смерти».",
                        )
                      }
                    }
                  })
                }
              />
            </CalculatorActionGroup>
            <CalculatorActionGroup title="Последствия серьёзной раны">
              <RuleButton
                disabled={constitution === null || isRolling}
                onClick={() =>
                  rollCheck(constitution, "ВЫН", (success) => {
                    if (!success) {
                      onReminder(
                        "Провал ВЫН после серьёзной раны: отметьте «Без сознания».",
                      )
                    }
                  })
                }
              >
                Проверка ВЫН
              </RuleButton>
            </CalculatorActionGroup>
            <CalculatorActionGroup title="Восстановление здоровья">
              <div className="grid grid-cols-2 gap-2">
                <RuleButton
                  disabled={!canChangeCurrent || isRolling}
                  onClick={() => changeCurrent(1)}
                >
                  Первая помощь +1
                </RuleButton>
                <RuleButton
                  disabled={!canChangeCurrent || isRolling}
                  onClick={() =>
                    rollExpression("1d3", "Медицина", changeCurrent)
                  }
                >
                  Медицина +1d3
                </RuleButton>
                <RuleButton
                  disabled={!canChangeCurrent || isRolling}
                  onClick={() => changeCurrent(1)}
                >
                  Восстановление +1
                </RuleButton>
              </div>
            </CalculatorActionGroup>
          </div>
        ) : null}

        {resource === "sanity" ? (
          <div className="grid gap-3">
            <CalculatorActionGroup title="Потеря рассудка">
              <FormulaAction
                disabled={!canChangeCurrent || isRolling}
                formula={formula}
                label="Формула броска"
                onFormulaChange={setFormula}
                onRoll={() =>
                  rollFormula("Потеря рассудка", (loss) => {
                    changeCurrent(-loss)
                    if (loss >= 5) {
                      onReminder(
                        "Потеря 5+ пунктов рассудка от одного источника: проведите проверку ИНТ.",
                      )
                    }
                    if (current !== null) {
                      onReminder(
                        `Проверьте потерю рассудка за игровой день: порог бессрочного безумия — ${Math.ceil(current / 5)}.`,
                      )
                    }
                  })
                }
              />
            </CalculatorActionGroup>
            <CalculatorActionGroup title="Проверка безумия">
              <RuleButton
                disabled={intelligence === null || isRolling}
                onClick={() =>
                  rollCheck(intelligence, "ИНТ", (success) => {
                    if (success) {
                      onReminder(
                        "Успешная ИНТ после сильной потери рассудка: отметьте «Временное безумие».",
                      )
                    }
                  })
                }
              >
                Проверка ИНТ
              </RuleButton>
            </CalculatorActionGroup>
            <CalculatorActionGroup title="Восстановление рассудка">
              <RuleButton
                disabled={!canChangeCurrent || isRolling}
                onClick={() =>
                  rollExpression(
                    "1d3",
                    "Восстановление рассудка",
                    changeCurrent,
                  )
                }
              >
                Восстановить рассудок +1d3
              </RuleButton>
            </CalculatorActionGroup>
          </div>
        ) : null}

        {resource === "mp" ? (
          <CalculatorActionGroup
            description="Очки магии восстанавливаются после отдыха: обычно 1 очко за час, а при Мощи выше 100 — 2 очка. Используйте кнопку, когда в игре прошёл час восстановления."
            title="Восстановление магии"
          >
            <RuleButton
              disabled={!canChangeCurrent || isRolling}
              onClick={() =>
                changeCurrent(power !== null && power > 100 ? 2 : 1)
              }
            >
              Восстановить за час +{power !== null && power > 100 ? 2 : 1}
            </RuleButton>
          </CalculatorActionGroup>
        ) : null}

        {resource === "luck" ? (
          <CalculatorActionGroup
            description="По правилам CoC 7e удачу можно восстанавливать в фазе развития после неудачной проверки Удачи. Бросок возвращает 1d10 очков удачи в черновик."
            title="Восстановление удачи"
          >
            <RuleButton
              disabled={!canChangeCurrent || isRolling}
              onClick={() =>
                rollExpression("1d10", "Восстановление удачи", changeCurrent)
              }
            >
              Восстановить удачу +1d10
            </RuleButton>
          </CalculatorActionGroup>
        ) : null}
      </section>
    </TooltipProvider>
  )
}

function CalculatorActionGroup({
  children,
  description,
  title,
}: {
  children: React.ReactNode
  description?: string
  title: string
}) {
  return (
    <div className="rounded-sm border border-[var(--ml-border-aged)]/85 bg-[linear-gradient(135deg,rgba(63,51,34,0.55),rgba(25,22,18,0.82))] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="font-heading text-sm font-semibold uppercase tracking-[0.09em] text-[var(--ml-accent-aged-gold)]">
          {title}
        </p>
        {description ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label={`Справка: ${title}`}
                className="size-6 shrink-0 rounded-full border border-[var(--ml-border-aged)] text-[var(--ml-ink-muted)] hover:border-[var(--ml-accent-aged-gold)] hover:text-[var(--ml-accent-aged-gold)]"
                size="icon-xs"
                type="button"
                variant="ghost"
              >
                <Info aria-hidden="true" className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              className="max-w-72 border border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel)] text-[var(--ml-ink-primary)] shadow-xl"
              side="top"
            >
              {description}
            </TooltipContent>
          </Tooltip>
        ) : null}
      </div>
      {children}
    </div>
  )
}

function FormulaAction({
  disabled,
  formula,
  label,
  onFormulaChange,
  onRoll,
}: {
  disabled: boolean
  formula: string
  label: string
  onFormulaChange: (value: string) => void
  onRoll: () => void
}) {
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
          className="border-[var(--ml-accent-brass-strong)]/65 bg-[color-mix(in_srgb,var(--ml-bg-page)_88%,black)] font-mono text-base font-semibold text-[var(--ml-accent-aged-gold)] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.45)] placeholder:text-[var(--ml-ink-muted)] focus-visible:border-[var(--ml-focus-ring)]"
          id={`${label}-formula`}
          onChange={(event) => onFormulaChange(event.target.value)}
          value={formula}
        />
      </Field>
      <RuleButton disabled={disabled || !formula.trim()} onClick={onRoll}>
        Бросить
      </RuleButton>
    </div>
  )
}

function RuleButton({
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      className="h-9 border border-[var(--ml-accent-brass-strong)]/80 bg-[linear-gradient(180deg,rgba(92,73,45,0.75),rgba(50,41,29,0.9))] px-3 font-body text-sm font-semibold text-[var(--ml-ink-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-[var(--ml-accent-aged-gold)] hover:bg-[var(--ml-surface-panel-raised)] disabled:border-[var(--ml-border-subtle)] disabled:bg-transparent disabled:text-[var(--ml-ink-muted)] disabled:opacity-40"
      type="button"
      variant="ghost"
    >
      {children}
    </Button>
  )
}
