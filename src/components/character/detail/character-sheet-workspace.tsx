"use client"

import { useCallback, useEffect, useRef } from "react"
import type {
  GroupImperativeHandle,
  Layout,
  LayoutChangedMeta,
} from "react-resizable-panels"

import { CharacterSheetTabs } from "@/components/character/detail/character-sheet-tabs"
import { CharacterSkills } from "@/components/character/detail/character-skills"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { characterSheetLayoutStorageKey } from "@/lib/utils/character-sheet-layout.util"
import type { CharacterDetail } from "@/types/character"

type CharacterSheetWorkspaceProps = {
  character: CharacterDetail
}

const SKILLS_PANEL_ID = "character-skills"
const SECTIONS_PANEL_ID = "character-sections"
const DEFAULT_LAYOUT: Layout = {
  [SKILLS_PANEL_ID]: 58,
  [SECTIONS_PANEL_ID]: 42,
}

function parseStoredLayout(value: string | null): Layout | null {
  if (!value) return null

  try {
    const layout = JSON.parse(value) as Partial<Layout>
    const skills = layout[SKILLS_PANEL_ID]
    const sections = layout[SECTIONS_PANEL_ID]

    if (
      typeof skills !== "number" ||
      typeof sections !== "number" ||
      skills < 45 ||
      skills > 68 ||
      sections < 32 ||
      sections > 55 ||
      Math.abs(skills + sections - 100) > 0.1
    ) {
      return null
    }

    return {
      [SKILLS_PANEL_ID]: skills,
      [SECTIONS_PANEL_ID]: sections,
    }
  } catch {
    return null
  }
}

export function CharacterSheetWorkspace({
  character,
}: CharacterSheetWorkspaceProps) {
  const groupRef = useRef<GroupImperativeHandle>(null)
  const storageKey = characterSheetLayoutStorageKey(character.id)

  useEffect(() => {
    const storedLayout = parseStoredLayout(
      window.localStorage.getItem(storageKey),
    )
    if (storedLayout) groupRef.current?.setLayout(storedLayout)
  }, [storageKey])

  const saveLayout = useCallback(
    (layout: Layout, meta: LayoutChangedMeta) => {
      if (!meta.isUserInteraction) return
      window.localStorage.setItem(storageKey, JSON.stringify(layout))
    },
    [storageKey],
  )

  return (
    <ResizablePanelGroup
      className="min-h-[620px] flex-1 overflow-hidden rounded-md border border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel)]"
      defaultLayout={DEFAULT_LAYOUT}
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
            <CharacterSkills skills={character.skills} />
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
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
