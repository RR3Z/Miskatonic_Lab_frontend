"use client"

import { useState } from "react"
import { characterStateRules } from "@/components/character/detail/character-state-rules"
import { CharacterState } from "@/components/character/detail/header/character-state"
import { CHARACTER_STATE_GROUPS } from "@/components/character/detail/header/character-state-group-definitions"
import type { CharacterStateValues } from "@/components/character/detail/header/character-state-types"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils/cn.util"

export function CharacterStatesGrid({
  initialValues,
}: {
  initialValues: CharacterStateValues
}) {
  const [states, setStates] = useState(initialValues)
  const toggleState = (state: keyof CharacterStateValues) => {
    setStates((current) => ({ ...current, [state]: !current[state] }))
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
                  key={state.key}
                  onToggle={() => toggleState(state.key)}
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
