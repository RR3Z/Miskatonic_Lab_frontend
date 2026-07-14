"use client"

import { useState } from "react"
import { toast } from "sonner"
import { characterStateRules } from "@/components/character/detail/character-state-rules"
import { CharacterState } from "@/components/character/detail/header/character-state"
import { CHARACTER_STATE_GROUPS } from "@/components/character/detail/header/character-state-group-definitions"
import type { CharacterStateValues } from "@/components/character/detail/header/character-state-types"
import { createCharacterResourceUpdate } from "@/components/character/detail/header/create-character-resource-update"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useUpdateCharacterResource } from "@/lib/api/use-character-resources"
import { cn } from "@/lib/utils/cn.util"

export function CharacterStatesGrid({
  characterId,
  initialValues,
}: {
  characterId: string
  initialValues: CharacterStateValues
}) {
  const [states, setStates] = useState(initialValues)
  const [pendingState, setPendingState] = useState<
    keyof CharacterStateValues | null
  >(null)
  const mutation = useUpdateCharacterResource(characterId)

  async function toggleState(
    state: keyof CharacterStateValues,
    resource: "hp" | "sanity",
    backendField: string,
  ) {
    if (pendingState) return
    const previousValue = states[state]
    const nextValue = !previousValue
    setPendingState(state)
    setStates((current) => ({ ...current, [state]: nextValue }))

    try {
      await mutation.mutateAsync(
        createCharacterResourceUpdate(resource, backendField, nextValue),
      )
    } catch {
      setStates((current) => ({ ...current, [state]: previousValue }))
      toast.error("Не удалось сохранить состояние персонажа")
    } finally {
      setPendingState(null)
    }
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="grid min-h-0 flex-1 grid-cols-[1.15fr_0.85fr] items-stretch gap-2">
        {CHARACTER_STATE_GROUPS.map((group) => (
          <div className="flex min-h-0 flex-col" key={group.label}>
            <h3 className="mb-0.5 font-body text-[0.64rem] uppercase tracking-[0.12em] text-[var(--ml-ink-muted)]">
              {group.label}
            </h3>
            <div
              className={cn(
                "grid min-h-0 flex-1 auto-rows-fr gap-1.5",
                group.gridClassName,
              )}
            >
              {group.states.map((state) => (
                <CharacterState
                  active={states[state.key]}
                  disabled={pendingState === state.key}
                  key={state.key}
                  onToggle={() =>
                    void toggleState(
                      state.key,
                      state.resource,
                      state.backendField,
                    )
                  }
                  rule={characterStateRules[state.key]}
                  testId={state.testId}
                  tone={state.tone}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </TooltipProvider>
  )
}
