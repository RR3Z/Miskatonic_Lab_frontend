"use client"

import { useCallback, useEffect, useRef } from "react"
import type {
  GroupImperativeHandle,
  Layout,
  LayoutChangedMeta,
} from "react-resizable-panels"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { characterSheetLayoutStorageKey } from "@/lib/utils/character-sheet-layout.util"

type CharacterSheetWorkspaceProps = {
  characterId: string
}

const LEFT_PANEL_ID = "character-core"
const RIGHT_PANEL_ID = "character-content"
const DEFAULT_LAYOUT: Layout = {
  [LEFT_PANEL_ID]: 42,
  [RIGHT_PANEL_ID]: 58,
}

function parseStoredLayout(value: string | null): Layout | null {
  if (!value) return null

  try {
    const layout = JSON.parse(value) as Partial<Layout>
    const left = layout[LEFT_PANEL_ID]
    const right = layout[RIGHT_PANEL_ID]

    if (
      typeof left !== "number" ||
      typeof right !== "number" ||
      left < 32 ||
      left > 55 ||
      right < 45 ||
      right > 68 ||
      Math.abs(left + right - 100) > 0.1
    ) {
      return null
    }

    return { [LEFT_PANEL_ID]: left, [RIGHT_PANEL_ID]: right }
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
      className="h-[calc(100svh-15.5rem)] min-h-[620px] overflow-hidden rounded-md border border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel)]"
      defaultLayout={DEFAULT_LAYOUT}
      groupRef={groupRef}
      id={`character-sheet-${characterId}`}
      onLayoutChanged={saveLayout}
      orientation="horizontal"
    >
      <ResizablePanel
        defaultSize="42%"
        id={LEFT_PANEL_ID}
        maxSize="55%"
        minSize="32%"
      >
        <div
          className="flex h-full flex-col gap-3 overflow-y-auto p-4"
          data-testid="character-core-panel"
        >
          <WorkspaceSection title="Характеристики">
            Значения характеристик появятся на следующем этапе.
          </WorkspaceSection>
          <WorkspaceSection title="Производные параметры">
            Скорость, телосложение, бонус к урону и уклонение.
          </WorkspaceSection>
          <WorkspaceSection title="Состояния">
            Раны, сознание и состояния рассудка.
          </WorkspaceSection>
        </div>
      </ResizablePanel>

      <ResizableHandle
        aria-label="Изменить ширину панелей листа"
        className="bg-[var(--ml-border-aged)] transition-colors hover:bg-[var(--ml-accent-brass-strong)] focus-visible:bg-[var(--ml-accent-brass-strong)]"
        withHandle
      />

      <ResizablePanel
        defaultSize="58%"
        id={RIGHT_PANEL_ID}
        maxSize="68%"
        minSize="45%"
      >
        <div
          className="flex h-full min-w-0 flex-col"
          data-testid="character-content-panel"
        >
          <nav
            aria-label="Разделы листа персонажа"
            className="flex shrink-0 gap-1 border-b border-[var(--ml-border-subtle)] px-4 pt-3"
          >
            {[
              "Навыки",
              "История",
              "Имущество",
              "Заметки",
              "Оружие и атаки",
            ].map((label, index) => (
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
            ))}
          </nav>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <WorkspaceSection title="Навыки">
              Алфавитные секции навыков появятся на следующем этапе.
            </WorkspaceSection>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
