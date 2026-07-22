"use client"

import type { CSSProperties } from "react"
import { useState } from "react"
import { toast } from "sonner"
import { CharacterSheetTooltipProvider } from "@/components/character/detail/character-sheet-tooltip/character-sheet-tooltip-provider"
import { DiceRollResultToast } from "@/components/character/detail/header/dice-result-toast/dice-roll-result-toast"
import { FormulaDiceRollResultToast } from "@/components/character/detail/header/dice-result-toast/formula-dice-roll-result-toast"
import {
  getDiceRollToastClassName,
  getDiceRollToastCloseButtonClassName,
  getDiceRollToastStyle,
} from "@/components/character/detail/header/dice-result-toast/utils/dice-roll-toast-style.util"
import { CalculatorActionGroup } from "@/components/character/detail/header/resource-calculator/calculator-action-group"
import { FormulaAction } from "@/components/character/detail/header/resource-calculator/formula-action"
import { RuleButton } from "@/components/character/detail/header/resource-calculator/rule-button"
import {
  DICE_RESULT_TOAST_DURATION_MS,
  DICE_RESULT_TOASTER_ID,
} from "@/components/ui/sonner/constants/sonner.constants"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"
import { formatLocalizedTemplate } from "@/data/locales/utils/format-localized-template.util"
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
          duration: DICE_RESULT_TOAST_DURATION_MS,
          style: { "--dice-roll-border-color": "#b6a367" } as CSSProperties,
          toasterId: DICE_RESULT_TOASTER_ID,
        },
      )
      apply(roll.result)
    } catch {
      toast.error(
        localizedContent.copy.characterDetailHeaderResourceCalculatorActions
          .neUdalosVypolnitBrosok,
      )
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
          duration: DICE_RESULT_TOAST_DURATION_MS,
          style: getDiceRollToastStyle(check.outcome),
          toasterId: DICE_RESULT_TOASTER_ID,
        },
      )
      onOutcome(success)
    } catch {
      toast.error(
        localizedContent.copy.characterDetailHeaderResourceCalculatorActions
          .neUdalosVypolnitBrosok,
      )
    }
  }

  return (
    <CharacterSheetTooltipProvider>
      <section
        className="relative z-10 mt-1 grid gap-3"
        data-testid="resource-calculator-actions"
      >
        {resource === "hp" ? (
          <div className="grid gap-3">
            <CalculatorActionGroup
              title={
                localizedContent.copy
                  .characterDetailHeaderResourceCalculatorActions.uron
              }
            >
              <FormulaAction
                disabled={!canChangeCurrent || isRolling}
                formula={formula}
                label={
                  localizedContent.copy
                    .characterDetailHeaderResourceCalculatorActions
                    .formulaBroska
                }
                onFormulaChange={setFormula}
                onRoll={() =>
                  rollFormula(
                    localizedContent.copy
                      .characterDetailHeaderResourceCalculatorActions.uron,
                    (damage) => {
                      changeCurrent(-damage)
                      if (max !== null && damage > max) {
                        onReminder(
                          localizedContent.copy
                            .characterDetailHeaderResourceCalculatorActions
                            .uronPrevyshaetMaksimumZdorovyaOtmetteMertv,
                        )
                      } else if (max !== null && damage >= max / 2) {
                        onReminder(
                          localizedContent.copy
                            .characterDetailHeaderResourceCalculatorActions
                            .uronNeMenshePolovinyMaksimalnogoZdorovya,
                        )
                      }
                      if (current !== null && current - damage <= 0) {
                        onReminder(
                          localizedContent.copy
                            .characterDetailHeaderResourceCalculatorActions
                            .zdoroveOpustilosDo0OtmetteBez,
                        )
                        if (majorWound || (max !== null && damage >= max / 2)) {
                          onReminder(
                            localizedContent.copy
                              .characterDetailHeaderResourceCalculatorActions
                              .copy0ZdorovyaPriSereznoiRaneOtmette,
                          )
                        }
                      }
                    },
                  )
                }
              />
            </CalculatorActionGroup>
            <CalculatorActionGroup
              title={
                localizedContent.copy
                  .characterDetailHeaderResourceCalculatorActions
                  .posledstviyaSereznoiRany
              }
            >
              <RuleButton
                disabled={constitution === null || isRolling}
                onClick={() =>
                  rollCheck(
                    constitution,
                    localizedContent.copy
                      .characterDetailHeaderResourceCalculatorActions.vyn,
                    (success) => {
                      if (!success) {
                        onReminder(
                          localizedContent.copy
                            .characterDetailHeaderResourceCalculatorActions
                            .provalVynPosleSereznoiRanyOtmette,
                        )
                      }
                    },
                  )
                }
              >
                {
                  localizedContent.copy
                    .characterDetailHeaderResourceCalculatorActions.proverkaVyn
                }
              </RuleButton>
            </CalculatorActionGroup>
            <CalculatorActionGroup
              title={
                localizedContent.copy
                  .characterDetailHeaderResourceCalculatorActions
                  .vosstanovlenieZdorovya
              }
            >
              <div className="grid grid-cols-2 gap-2">
                <RuleButton
                  disabled={!canChangeCurrent || isRolling}
                  onClick={() => changeCurrent(1)}
                >
                  {
                    localizedContent.copy
                      .characterDetailHeaderResourceCalculatorActions
                      .pervayaPomosch1
                  }
                </RuleButton>
                <RuleButton
                  disabled={!canChangeCurrent || isRolling}
                  onClick={() =>
                    rollExpression(
                      "1d3",
                      localizedContent.copy
                        .characterDetailHeaderResourceCalculatorActions
                        .meditsina,
                      changeCurrent,
                    )
                  }
                >
                  {
                    localizedContent.copy
                      .characterDetailHeaderResourceCalculatorActions
                      .meditsina1d3
                  }
                </RuleButton>
                <RuleButton
                  disabled={!canChangeCurrent || isRolling}
                  onClick={() => changeCurrent(1)}
                >
                  {
                    localizedContent.copy
                      .characterDetailHeaderResourceCalculatorActions
                      .vosstanovlenie1
                  }
                </RuleButton>
              </div>
            </CalculatorActionGroup>
          </div>
        ) : null}

        {resource === "sanity" ? (
          <div className="grid gap-3">
            <CalculatorActionGroup
              title={
                localizedContent.copy
                  .characterDetailHeaderResourceCalculatorActions
                  .poteryaRassudka
              }
            >
              <FormulaAction
                disabled={!canChangeCurrent || isRolling}
                formula={formula}
                label={
                  localizedContent.copy
                    .characterDetailHeaderResourceCalculatorActions
                    .formulaBroska
                }
                onFormulaChange={setFormula}
                onRoll={() =>
                  rollFormula(
                    localizedContent.copy
                      .characterDetailHeaderResourceCalculatorActions
                      .poteryaRassudka,
                    (loss) => {
                      changeCurrent(-loss)
                      if (loss >= 5) {
                        onReminder(
                          localizedContent.copy
                            .characterDetailHeaderResourceCalculatorActions
                            .poterya5PunktovRassudkaOtOdnogo,
                        )
                      }
                      if (current !== null) {
                        onReminder(
                          formatLocalizedTemplate(
                            localizedContent.copy
                              .characterDetailHeaderResourceCalculatorActions
                              .provertePoteryuRassudkaZaIgrovoiDen,
                            { value0: Math.ceil(current / 5) },
                          ),
                        )
                      }
                    },
                  )
                }
              />
            </CalculatorActionGroup>
            <CalculatorActionGroup
              title={
                localizedContent.copy
                  .characterDetailHeaderResourceCalculatorActions
                  .proverkaBezumiya
              }
            >
              <RuleButton
                disabled={intelligence === null || isRolling}
                onClick={() =>
                  rollCheck(
                    intelligence,
                    localizedContent.copy
                      .characterDetailHeaderResourceCalculatorActions.int,
                    (success) => {
                      if (success) {
                        onReminder(
                          localizedContent.copy
                            .characterDetailHeaderResourceCalculatorActions
                            .uspeshnayaIntPosleSilnoiPoteriRassudka,
                        )
                      }
                    },
                  )
                }
              >
                {
                  localizedContent.copy
                    .characterDetailHeaderResourceCalculatorActions.proverkaInt
                }
              </RuleButton>
            </CalculatorActionGroup>
            <CalculatorActionGroup
              title={
                localizedContent.copy
                  .characterDetailHeaderResourceCalculatorActions
                  .vosstanovlenieRassudka
              }
            >
              <RuleButton
                disabled={!canChangeCurrent || isRolling}
                onClick={() =>
                  rollExpression(
                    "1d3",
                    localizedContent.copy
                      .characterDetailHeaderResourceCalculatorActions
                      .vosstanovlenieRassudka,
                    changeCurrent,
                  )
                }
              >
                {
                  localizedContent.copy
                    .characterDetailHeaderResourceCalculatorActions
                    .vosstanovitRassudok1d3
                }
              </RuleButton>
            </CalculatorActionGroup>
          </div>
        ) : null}

        {resource === "mp" ? (
          <CalculatorActionGroup
            description={
              localizedContent.copy
                .characterDetailHeaderResourceCalculatorActions
                .ochkiMagiiVosstanavlivayutsyaPosleOtdyhaObychno
            }
            title={
              localizedContent.copy
                .characterDetailHeaderResourceCalculatorActions
                .vosstanovlenieMagii
            }
          >
            <RuleButton
              disabled={!canChangeCurrent || isRolling}
              onClick={() =>
                changeCurrent(power !== null && power > 100 ? 2 : 1)
              }
            >
              {
                localizedContent.copy
                  .characterDetailHeaderResourceCalculatorActions
                  .vosstanovitZaChas
              }
              {power !== null && power > 100 ? 2 : 1}
            </RuleButton>
          </CalculatorActionGroup>
        ) : null}

        {resource === "luck" ? (
          <CalculatorActionGroup
            description={
              localizedContent.copy
                .characterDetailHeaderResourceCalculatorActions
                .poPravilamCoc7eUdachuMozhno
            }
            title={
              localizedContent.copy
                .characterDetailHeaderResourceCalculatorActions
                .vosstanovlenieUdachi
            }
          >
            <RuleButton
              disabled={!canChangeCurrent || isRolling}
              onClick={() =>
                rollExpression(
                  "1d10",
                  localizedContent.copy
                    .characterDetailHeaderResourceCalculatorActions
                    .vosstanovlenieUdachi,
                  changeCurrent,
                )
              }
            >
              {
                localizedContent.copy
                  .characterDetailHeaderResourceCalculatorActions
                  .vosstanovitUdachu1d10
              }
            </RuleButton>
          </CalculatorActionGroup>
        ) : null}
      </section>
    </CharacterSheetTooltipProvider>
  )
}
