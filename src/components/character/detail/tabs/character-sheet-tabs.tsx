"use client"

import { CharacterSheetTooltipProvider } from "@/components/character/detail/character-sheet-tooltip"
import { FinancesSection } from "@/components/character/detail/tabs/finances-section"
import { HistorySection } from "@/components/character/detail/tabs/history-section"
import { InventoryTab } from "@/components/character/detail/tabs/inventory-tab"
import { NotesTab } from "@/components/character/detail/tabs/notes-tab"
import { ScrollableTabsContent } from "@/components/character/detail/tabs/scrollable-tabs-content"
import {
  CHARACTER_SHEET_TABS,
  TAB_TRIGGER_CLASS_NAME,
} from "@/components/character/detail/tabs/tab-definitions"
import { WeaponsTab } from "@/components/character/detail/tabs/weapons-tab"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type {
  CharacterBackstory,
  CharacterFinances,
  CharacterNote,
} from "@/types/character"

export function CharacterSheetTabs({
  backstory,
  characterId,
  finances,
  notes,
}: {
  backstory: CharacterBackstory
  characterId: string
  finances: CharacterFinances
  notes: CharacterNote[] | null
}) {
  return (
    <Tabs
      className="h-full min-h-0 flex-1 gap-0 overflow-hidden"
      defaultValue="biography"
    >
      <TabsList
        aria-label="Разделы листа персонажа"
        className="relative h-10 w-full shrink-0 justify-start gap-0 overflow-x-auto overflow-y-hidden rounded-none border-b border-[var(--ml-border-subtle)] bg-transparent p-0 px-3 xl:overflow-visible"
        variant="line"
      >
        {CHARACTER_SHEET_TABS.map((tab) => (
          <TabsTrigger
            className={TAB_TRIGGER_CLASS_NAME}
            key={tab.value}
            value={tab.value}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <ScrollableTabsContent value="biography">
        <CharacterSheetTooltipProvider>
          <HistorySection backstory={backstory} characterId={characterId} />
        </CharacterSheetTooltipProvider>
      </ScrollableTabsContent>
      <ScrollableTabsContent value="finances">
        <CharacterSheetTooltipProvider>
          <FinancesSection characterId={characterId} finances={finances} />
        </CharacterSheetTooltipProvider>
      </ScrollableTabsContent>
      <ScrollableTabsContent value="inventory">
        <InventoryTab />
      </ScrollableTabsContent>
      <ScrollableTabsContent value="notes">
        <NotesTab characterId={characterId} notes={notes} />
      </ScrollableTabsContent>
      <ScrollableTabsContent value="weapons">
        <WeaponsTab />
      </ScrollableTabsContent>
    </Tabs>
  )
}
