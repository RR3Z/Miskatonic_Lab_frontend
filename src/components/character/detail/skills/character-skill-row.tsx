"use client"

import { PencilLine } from "lucide-react"
import { motion } from "motion/react"
import { useState } from "react"
import { toast } from "sonner"
import { DeleteResourceButton } from "@/components/character/detail/editors/delete-resource-button"
import { DiceRollResultToast } from "@/components/character/detail/header/dice-result-toast/dice-roll-result-toast"
import {
  getDiceRollToastClassName,
  getDiceRollToastCloseButtonClassName,
  getDiceRollToastStyle,
} from "@/components/character/detail/header/dice-result-toast/utils/dice-roll-toast-style.util"
import { CharacterSkillEditorDialog } from "@/components/character/detail/skills/character-skill-editor-dialog"
import { SkillDevelopmentMark } from "@/components/character/detail/skills/skill-development-mark"
import { SkillDiceCard } from "@/components/character/detail/skills/skill-dice-card"
import {
  clampSkillTotal,
  getEffectiveSkillTotal,
} from "@/components/character/detail/skills/utils/skill-values.util"
import { Button } from "@/components/ui/button"
import {
  DICE_RESULT_TOAST_DURATION_MS,
  DICE_RESULT_TOASTER_ID,
} from "@/components/ui/sonner/constants/sonner.constants"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"
import { formatLocalizedTemplate } from "@/data/locales/utils/format-localized-template.util"
import { useMakeCharacterDiceRoll } from "@/hooks/character/use-character-dice-rolls"
import { useDeleteCharacterSkill } from "@/hooks/character/use-delete-character-skill"
import { useUpdateCharacterSkill } from "@/hooks/character/use-update-character-skill"
import {
  type D100Mode,
  parseD100RollDetails,
} from "@/lib/api/character-dice-rolls"
import { classifyCharacteristicCheck } from "@/lib/dice/characteristic-check"
import type { CharacterSkill } from "@/types/character.types"

export function CharacterSkillRow({
  characterId,
  reducedMotion = false,
  skill,
  unavailableReason,
}: {
  characterId: string
  reducedMotion?: boolean
  skill: CharacterSkill
  unavailableReason: string | null
}) {
  const deleteMutation = useDeleteCharacterSkill(characterId)
  const rollMutation = useMakeCharacterDiceRoll(characterId)
  const updateMutation = useUpdateCharacterSkill(characterId, skill.id)
  const [editorOpen, setEditorOpen] = useState(false)
  const effectiveTotal = getEffectiveSkillTotal(skill)
  const isAtMaximum = effectiveTotal >= 100
  const isBaseAvailable = unavailableReason === null
  const baseLabel = isBaseAvailable
    ? `${clampSkillTotal(skill.base_value)}%`
    : "—"
  const label = `${skill.name} (${baseLabel})`
  const input = {
    name: skill.name,
    base_value: skill.base_value,
    value: skill.value,
    checked: skill.checked,
  }

  async function makeSkillCheck(mode: D100Mode) {
    if (!isBaseAvailable) return

    try {
      const roll = await rollMutation.mutateAsync({
        expression: "1d100",
        d100Mode: mode,
      })
      const check = classifyCharacteristicCheck(effectiveTotal, roll.result)
      const success = check.outcome !== "failure" && check.outcome !== "fumble"
      if (success && !isAtMaximum && !skill.checked) {
        await updateMutation.mutateAsync({ ...input, checked: true })
      }

      toast(
        <DiceRollResultToast
          details={parseD100RollDetails(roll.details)}
          outcome={check.outcome}
          result={roll.result}
          title={skill.name}
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
    } catch {
      toast.error(
        formatLocalizedTemplate(
          localizedContent.copy.characterDetailSkillsCharacterSkillRow
            .neUdalosProveritNavykValue0,
          { value0: skill.name },
        ),
      )
    }
  }

  return (
    <motion.li
      animate={{ opacity: 1, y: 0 }}
      className="flex min-w-0 items-stretch gap-1.5"
      data-testid="character-skill"
      exit={{ opacity: 0, y: -4 }}
      initial={reducedMotion ? false : { opacity: 0, y: 4 }}
      layout={reducedMotion ? false : "position"}
      transition={
        reducedMotion
          ? { duration: 0 }
          : { duration: 0.18, ease: [0.22, 1, 0.36, 1] }
      }
    >
      <SkillDevelopmentMark
        checked={skill.checked}
        disabled={updateMutation.isPending || isAtMaximum}
        onToggle={() =>
          updateMutation.mutate({ ...input, checked: !skill.checked })
        }
      />
      <div className="min-w-0 flex-1">
        <span className="sr-only" data-testid="character-skill-base-value">
          {baseLabel}
        </span>
        <SkillDiceCard
          disabledReason={unavailableReason}
          label={label}
          onRoll={(mode) => void makeSkillCheck(mode)}
          rolling={rollMutation.isPending}
          value={isBaseAvailable ? effectiveTotal : null}
        />
      </div>
      <div
        className="flex w-7 shrink-0 flex-col justify-center gap-1"
        data-testid="character-skill-actions"
      >
        <Button
          aria-label={formatLocalizedTemplate(
            localizedContent.copy.characterDetailSkillsCharacterSkillRow
              .redaktirovatNavykValue0,
            { value0: skill.name },
          )}
          className="size-7 shrink-0 border-[var(--ml-accent-brass-strong)]/70 bg-[color-mix(in_srgb,var(--ml-accent-brass-strong)_10%,transparent)] text-[var(--ml-accent-aged-gold)] hover:border-[var(--ml-accent-aged-gold)] hover:bg-[color-mix(in_srgb,var(--ml-accent-brass-strong)_20%,transparent)] hover:text-[var(--ml-ink-primary)] disabled:cursor-wait"
          disabled={updateMutation.isPending}
          onClick={() => setEditorOpen(true)}
          size="icon-sm"
          type="button"
          variant="secondary"
        >
          <PencilLine aria-hidden="true" className="size-3.5" />
        </Button>
        {!skill.is_protected ? (
          <DeleteResourceButton
            ariaLabel={formatLocalizedTemplate(
              localizedContent.copy.characterDetailSkillsCharacterSkillRow
                .udalitNavykValue0,
              { value0: skill.name },
            )}
            className="size-7 shrink-0 border border-[var(--ml-accent-danger)]/70 bg-[color-mix(in_srgb,var(--ml-accent-danger)_12%,transparent)] text-[#f2a29e] hover:border-[var(--ml-accent-danger)] hover:bg-[color-mix(in_srgb,var(--ml-accent-danger)_24%,transparent)] hover:text-[#ffd0cc]"
            description={formatLocalizedTemplate(
              localizedContent.copy.characterDetailSkillsCharacterSkillRow
                .navykValue0BudetUdalenUPersonazha,
              { value0: skill.name },
            )}
            errorMessage={
              localizedContent.copy.characterDetailSkillsCharacterSkillRow
                .neUdalosUdalitNavykVozmozhnoOn
            }
            onDelete={() => deleteMutation.mutateAsync(skill.id)}
            title={
              localizedContent.copy.characterDetailSkillsCharacterSkillRow
                .udalitNavyk
            }
          />
        ) : null}
      </div>
      <CharacterSkillEditorDialog
        canEditDefinition={!skill.is_protected}
        initialValue={input}
        isPending={updateMutation.isPending}
        onOpenChange={setEditorOpen}
        onSubmit={updateMutation.mutateAsync}
        open={editorOpen}
        title={formatLocalizedTemplate(
          localizedContent.copy.characterDetailSkillsCharacterSkillRow
            .redaktirovatValue0,
          { value0: skill.name },
        )}
      />
    </motion.li>
  )
}
