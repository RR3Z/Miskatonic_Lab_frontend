"use client"

import { CharacterSectionsPanel } from "@/components/character/detail/layout/character-sections-panel"
import { CharacterSkillsPanel } from "@/components/character/detail/layout/character-skills-panel"
import { ResizableHandle } from "@/components/ui/resizable/resizable-handle"
import { ResizablePanel } from "@/components/ui/resizable/resizable-panel"
import { ResizablePanelGroup } from "@/components/ui/resizable/resizable-panel-group"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"
import { useCharacterSheetLayout } from "@/hooks/character/use-character-sheet-layout"
import { useDesktopCharacterSheet } from "@/hooks/character/use-desktop-character-sheet"
import {
  DEFAULT_CHARACTER_SHEET_LAYOUT,
  SECTIONS_PANEL_ID,
  SKILLS_PANEL_ID,
} from "@/lib/character/constants/character-sheet-layout.constants"
import type { CharacterDetail } from "@/types/character.types"

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
      className="min-h-0 flex-1 overflow-hidden rounded-md border border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel)]"
      defaultLayout={DEFAULT_CHARACTER_SHEET_LAYOUT}
      groupRef={groupRef}
      id={`character-sheet-${character.id}`}
      onLayoutChanged={saveLayout}
      orientation="horizontal"
    >
      <ResizablePanel
        className="min-h-0 overflow-hidden"
        defaultSize="58%"
        id={SKILLS_PANEL_ID}
        maxSize="68%"
        minSize="45%"
      >
        <CharacterSkillsPanel character={character} />
      </ResizablePanel>

      <ResizableHandle
        aria-label={
          localizedContent.copy.characterDetailLayoutCharacterSheetWorkspace
            .izmenitShirinuPaneleiLista
        }
        className="w-0.5 cursor-col-resize bg-[var(--ml-border-aged)] transition-colors hover:bg-[var(--ml-accent-brass-strong)] focus-visible:bg-[var(--ml-accent-brass-strong)]"
        withHandle
      />

      <ResizablePanel
        className="min-h-0 overflow-hidden"
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
