"use client"

import {
  DEFAULT_CHARACTER_SHEET_LAYOUT,
  SECTIONS_PANEL_ID,
  SKILLS_PANEL_ID,
} from "@/components/character/detail/layout/character-sheet-layout-definitions"
import { useCharacterSheetLayout } from "@/components/character/detail/layout/use-character-sheet-layout"
import { CharacterSkills } from "@/components/character/detail/skills/character-skills"
import { CharacterSheetTabs } from "@/components/character/detail/tabs/character-sheet-tabs"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { CharacterDetail } from "@/types/character"

export function CharacterSheetWorkspace({
  character,
}: {
  character: CharacterDetail
}) {
  const { groupRef, saveLayout } = useCharacterSheetLayout(character.id)

  return (
    <ResizablePanelGroup
      className="min-h-[620px] flex-1 overflow-hidden rounded-md border border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel)]"
      defaultLayout={DEFAULT_CHARACTER_SHEET_LAYOUT}
      groupRef={groupRef}
      id={`character-sheet-${character.id}`}
      onLayoutChanged={saveLayout}
      orientation="horizontal"
    >
      <ResizablePanel
        defaultSize="58%"
        id={SKILLS_PANEL_ID}
        maxSize="68%"
        minSize="45%"
      >
        <ScrollArea className="h-full" data-testid="character-skills-panel">
          <div className="p-4">
            <CharacterSkills
              characterId={character.id}
              skills={character.skills}
            />
          </div>
        </ScrollArea>
      </ResizablePanel>

      <ResizableHandle
        aria-label="Изменить ширину панелей листа"
        className="w-0.5 cursor-col-resize bg-[var(--ml-border-aged)] transition-colors hover:bg-[var(--ml-accent-brass-strong)] focus-visible:bg-[var(--ml-accent-brass-strong)]"
        withHandle
      />

      <ResizablePanel
        defaultSize="42%"
        id={SECTIONS_PANEL_ID}
        maxSize="55%"
        minSize="32%"
      >
        <div
          className="flex h-full min-w-0 flex-col"
          data-testid="character-sections-panel"
        >
          <CharacterSheetTabs
            backstory={character.backstory}
            characterId={character.id}
            finances={character.finances}
            notes={character.notes}
            skills={character.skills}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
