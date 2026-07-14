"use client"

import { HistoryFinancesTab } from "@/components/character/detail/tabs/history-finances-tab"
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
  CharacterSkill,
} from "@/types/character"

export function CharacterSheetTabs({
  backstory,
  characterId,
  finances,
  notes,
  skills,
}: {
  backstory: CharacterBackstory
  characterId: string
  finances: CharacterFinances
  notes: CharacterNote[] | null
  skills: CharacterSkill[] | null
}) {
  return (
    <Tabs className="min-h-0 flex-1 gap-0" defaultValue="history-finances">
      <TabsList
        aria-label="Разделы листа персонажа"
        className="relative h-10 w-full shrink-0 justify-start gap-0 overflow-visible rounded-none border-b border-[var(--ml-border-subtle)] bg-transparent p-0 px-3"
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

      <ScrollableTabsContent value="history-finances">
        <HistoryFinancesTab
          backstory={backstory}
          characterId={characterId}
          finances={finances}
          skills={skills}
        />
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
