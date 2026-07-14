"use client"

import { useCallback, useEffect, useRef } from "react"
import type {
  GroupImperativeHandle,
  Layout,
  LayoutChangedMeta,
} from "react-resizable-panels"

import { CharacterSkills } from "@/components/character/detail/character-skills"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { characterSheetLayoutStorageKey } from "@/lib/utils/character-sheet-layout.util"
import type { CharacterSkill } from "@/types/character"

type CharacterSheetWorkspaceProps = {
  characterId: string
  skills: CharacterSkill[] | null
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

function WorkspaceSection({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <section className="rounded-md border border-[var(--ml-border-subtle)] bg-[var(--ml-surface-panel-raised)]/45 p-4">
      <h2 className="font-heading text-xl font-semibold tracking-wide text-[var(--ml-ink-primary)]">
        {title}
      </h2>
      <div className="mt-3 text-sm text-[var(--ml-ink-muted)]">{children}</div>
    </section>
  )
}

export function CharacterSheetWorkspace({
  characterId,
  skills,
}: CharacterSheetWorkspaceProps) {
  const groupRef = useRef<GroupImperativeHandle>(null)
  const storageKey = characterSheetLayoutStorageKey(characterId)

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
      id={`character-sheet-${characterId}`}
      onLayoutChanged={saveLayout}
      orientation="horizontal"
    >
      <ResizablePanel
        defaultSize="58%"
        id={SKILLS_PANEL_ID}
        maxSize="68%"
        minSize="45%"
      >
        <div
          className="h-full overflow-y-auto p-4"
          data-testid="character-skills-panel"
        >
          <CharacterSkills skills={skills} />
        </div>
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
          <nav
            aria-label="Разделы листа персонажа"
            className="flex shrink-0 gap-1 border-b border-[var(--ml-border-subtle)] px-4 pt-3"
          >
            {["История", "Имущество", "Заметки", "Оружие и атаки"].map(
              (label, index) => (
                <span
                  aria-current={index === 0 ? "page" : undefined}
                  className={
                    index === 0
                      ? "border-b-2 border-[var(--ml-accent-brass-strong)] px-3 py-2 font-body text-sm text-[var(--ml-ink-primary)]"
                      : "px-3 py-2 font-body text-sm text-[var(--ml-ink-muted)]"
                  }
                  key={label}
                >
                  {label}
                </span>
              ),
            )}
          </nav>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <WorkspaceSection title="История">
              История персонажа появится на этапе наполнения вкладок.
            </WorkspaceSection>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
