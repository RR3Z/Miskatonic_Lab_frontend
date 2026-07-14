"use client"

import { CharacterSectionsPanel } from "@/components/character/detail/layout/character-sections-panel"
import {
  DEFAULT_CHARACTER_SHEET_LAYOUT,
  SECTIONS_PANEL_ID,
  SKILLS_PANEL_ID,
} from "@/components/character/detail/layout/character-sheet-layout-definitions"
import { CharacterSkillsPanel } from "@/components/character/detail/layout/character-skills-panel"
import { useCharacterSheetLayout } from "@/components/character/detail/layout/use-character-sheet-layout"
import { useDesktopCharacterSheet } from "@/components/character/detail/layout/use-desktop-character-sheet"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import type { CharacterDetail } from "@/types/character"

export function CharacterSheetWorkspace({
  character,
}: {
  character: CharacterDetail
}) {
  const isDesktop = useDesktopCharacterSheet()
  const { groupRef, saveLayout } = useCharacterSheetLayout(character.id)

  if (!isDesktop) {
    return (
      <div
        className="flex min-w-0 flex-col gap-3"
        data-testid="character-sheet-stacked-workspace"
      >
        <section className="h-[320px] overflow-hidden rounded-md border border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel)] sm:h-[360px]">
          <CharacterSkillsPanel character={character} />
        </section>
        <section className="h-[720px] overflow-hidden rounded-md border border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel)] sm:h-[760px]">
          <CharacterSectionsPanel character={character} />
        </section>
      </div>
    )
  }

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
        <CharacterSkillsPanel character={character} />
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
        <CharacterSectionsPanel character={character} />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
