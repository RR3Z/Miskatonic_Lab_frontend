"use client"

import { PencilLine, Swords } from "lucide-react"

import { CreateCharacterNoteDialog } from "@/components/character/detail/create-character-note-dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type {
  CharacterBackstory,
  CharacterFinances,
  CharacterNote,
} from "@/types/character"

type CharacterSheetTabsProps = {
  backstory: CharacterBackstory
  characterId: string
  finances: CharacterFinances
  notes: CharacterNote[] | null
}

const TAB_TRIGGER_CLASS_NAME =
  "h-full flex-none items-center rounded-none border-0 px-4 py-0 font-body text-sm hover:bg-[var(--ml-bg-page)]/30 data-active:bg-transparent data-active:text-[var(--ml-ink-primary)] after:pointer-events-none after:z-10 after:h-0.5 after:bg-[var(--ml-accent-brass-strong)] focus-visible:ring-1 focus-visible:ring-inset dark:data-active:bg-transparent"

const SHEET_CARD_CLASS_NAME =
  "min-w-0 rounded-sm border border-[var(--ml-border-subtle)] bg-[var(--ml-bg-page)]/20 p-3"

const BACKSTORY_SECTIONS = [
  { key: "description", label: "Описание" },
  { key: "traits", label: "Черты" },
  { key: "ideology_beliefs", label: "Идеалы и принципы" },
  { key: "injuries_scars", label: "Травмы и шрамы" },
  { key: "significant_people", label: "Значимые люди" },
  { key: "phobias_manias", label: "Фобии и мании" },
  { key: "meaningful_locations", label: "Важные места" },
  {
    key: "arcane_tomes_spells",
    label: "Магические книги, заклинания, артефакты",
  },
  { key: "treasured_possessions", label: "Ценное имущество" },
  { key: "encounters", label: "Встречи со сверхъестественным" },
] as const

function EmptySection({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-32 place-items-center rounded-sm border border-dashed border-[var(--ml-border-subtle)] px-5 py-6 text-center font-body text-sm text-[var(--ml-ink-muted)]">
      {children}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-heading text-lg font-semibold text-[var(--ml-ink-primary)]">
      {children}
    </h2>
  )
}

function EditableSectionHeader({
  editLabel,
  title,
  tooltip,
}: {
  editLabel: string
  title: string
  tooltip: string
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <SectionTitle>{title}</SectionTitle>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-disabled="true"
            aria-label={editLabel}
            className="aria-disabled:pointer-events-auto aria-disabled:cursor-not-allowed active:translate-y-0"
            onClick={(event) => event.preventDefault()}
            size="sm"
            tabIndex={0}
            type="button"
            variant="ghost"
          >
            <PencilLine aria-hidden="true" />
            Редактировать
          </Button>
        </TooltipTrigger>
        <TooltipContent
          className="border border-[#5d5231] bg-[#171411] text-[#d9d2c5] shadow-[0_14px_40px_rgba(0,0,0,0.55)] [&>span>svg]:bg-[#171411] [&>span>svg]:fill-[#171411]"
          side="bottom"
          sideOffset={6}
        >
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

function ContentCard({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <article className="rounded-sm border border-[var(--ml-border-subtle)] bg-[var(--ml-bg-page)]/20 p-3">
      <h3 className="font-heading text-base font-semibold text-[var(--ml-ink-primary)]">
        {title}
      </h3>
      <div className="mt-2 whitespace-pre-wrap font-body text-sm leading-6 text-[var(--ml-ink-muted)]">
        {children}
      </div>
    </article>
  )
}

function BackstorySection({
  backstory,
  section,
}: {
  backstory: CharacterBackstory
  section: (typeof BACKSTORY_SECTIONS)[number]
}) {
  const items =
    section.key === "description"
      ? []
      : (backstory.items ?? []).filter((item) => item.section === section.key)
  const isEmpty =
    section.key === "description"
      ? !backstory.personal_description
      : !items.length

  return (
    <div
      className={`${SHEET_CARD_CLASS_NAME} min-h-28`}
      data-section={section.key}
      data-testid="backstory-section"
    >
      <h3 className="font-body text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[var(--ml-accent-brass-strong)]">
        {section.label}
      </h3>
      {isEmpty ? (
        <p className="mt-3 font-body text-sm text-[var(--ml-ink-muted)]">—</p>
      ) : section.key === "description" ? (
        <p className="mt-2 whitespace-pre-wrap font-body text-sm leading-6 text-[var(--ml-ink-muted)]">
          {backstory.personal_description}
        </p>
      ) : (
        <div className="mt-2 space-y-2">
          {items.map((item) => (
            <div className="font-body text-sm leading-5" key={item.id}>
              <p className="font-semibold text-[var(--ml-ink-primary)]">
                {item.title}
              </p>
              <p className="whitespace-pre-wrap text-[var(--ml-ink-muted)]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function FinanceCard({
  className,
  label,
  value,
}: {
  className?: string
  label: string
  value: React.ReactNode
}) {
  return (
    <article
      className={`${SHEET_CARD_CLASS_NAME} ${className ?? ""}`}
      data-testid="finance-card"
    >
      <h3 className="font-body text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[var(--ml-accent-brass-strong)]">
        {label}
      </h3>
      <div className="mt-3 whitespace-pre-wrap font-body text-sm leading-6 text-[var(--ml-ink-muted)]">
        {value ?? "—"}
      </div>
    </article>
  )
}

function FinancesSection({ finances }: { finances: CharacterFinances }) {
  return (
    <section className="space-y-3" data-testid="character-finances-content">
      <EditableSectionHeader
        editLabel="Редактировать имущество"
        title="Имущество"
        tooltip="Редактирование имущества будет добавлено позже"
      />
      <div className="grid grid-cols-2 gap-3">
        <FinanceCard
          className="min-h-20"
          label="Карманные деньги"
          value={finances.spending_limit}
        />
        <FinanceCard
          className="min-h-20"
          label="Наличные"
          value={finances.cash}
        />
        <FinanceCard
          className="col-span-2 min-h-20"
          label="Кредитный рейтинг"
          value={
            finances.credit_rating ? (
              <span className="font-mono font-semibold tabular-nums">
                {finances.credit_rating.value}%
              </span>
            ) : null
          }
        />
        <FinanceCard
          className="col-span-2 min-h-32"
          label="Активы"
          value={finances.assets}
        />
      </div>
    </section>
  )
}

function InventorySection() {
  return (
    <section
      className="rounded-sm border border-[var(--ml-border-subtle)] bg-[var(--ml-bg-page)]/20 p-3"
      data-testid="character-inventory-content"
    >
      <SectionTitle>Инвентарь</SectionTitle>
      <div className="mt-3 grid min-h-36 grid-cols-2 divide-x divide-[var(--ml-border-subtle)] rounded-sm border border-[var(--ml-border-subtle)]">
        <div className="p-3 text-[var(--ml-ink-muted)]">—</div>
        <div className="p-3 text-[var(--ml-ink-muted)]">—</div>
      </div>
      <p className="mt-2 font-body text-xs leading-5 text-[var(--ml-ink-muted)]">
        Сохранение инвентаря пока не поддерживается Backend-моделью персонажа.
      </p>
    </section>
  )
}

function HistoryAndFinancesTab({
  backstory,
  finances,
}: {
  backstory: CharacterBackstory
  finances: CharacterFinances
}) {
  return (
    <TooltipProvider delayDuration={200}>
      <div
        className="space-y-5"
        data-testid="character-history-finances-content"
      >
        <section className="space-y-3" data-testid="character-history-content">
          <EditableSectionHeader
            editLabel="Редактировать биографию"
            title="Биография"
            tooltip="Редактирование биографии будет добавлено позже"
          />
          <div className="grid grid-cols-2 gap-3">
            {BACKSTORY_SECTIONS.map((section) => (
              <BackstorySection
                backstory={backstory}
                key={section.key}
                section={section}
              />
            ))}
          </div>
        </section>

        <FinancesSection finances={finances} />
      </div>
    </TooltipProvider>
  )
}

function NotesTab({
  characterId,
  notes,
}: {
  characterId: string
  notes: CharacterNote[] | null
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <SectionTitle>Заметки</SectionTitle>
        <CreateCharacterNoteDialog characterId={characterId} />
      </div>

      {notes?.length ? (
        <div className="space-y-3" data-testid="character-notes-content">
          {notes.map((note) => (
            <ContentCard key={note.id ?? note.title} title={note.title}>
              {note.body}
            </ContentCard>
          ))}
        </div>
      ) : (
        <EmptySection>Заметок пока нет.</EmptySection>
      )}
    </div>
  )
}

function WeaponsTab() {
  return (
    <EmptySection>
      <div className="flex max-w-sm flex-col items-center gap-3">
        <Swords
          aria-hidden="true"
          className="size-8 text-[var(--ml-accent-brass-strong)] opacity-70"
        />
        <p>Оружие и атаки пока не поддерживаются Backend-моделью персонажа.</p>
      </div>
    </EmptySection>
  )
}

function ScrollableTabsContent({
  children,
  value,
}: {
  children: React.ReactNode
  value: string
}) {
  return (
    <TabsContent className="min-h-0 overflow-hidden" value={value}>
      <ScrollArea className="h-full">
        <div className="p-4">{children}</div>
      </ScrollArea>
    </TabsContent>
  )
}

export function CharacterSheetTabs({
  backstory,
  characterId,
  finances,
  notes,
}: CharacterSheetTabsProps) {
  return (
    <Tabs className="min-h-0 flex-1 gap-0" defaultValue="history-finances">
      <TabsList
        aria-label="Разделы листа персонажа"
        className="relative h-10 w-full shrink-0 justify-start gap-0 overflow-visible rounded-none border-b border-[var(--ml-border-subtle)] bg-transparent p-0 px-3"
        variant="line"
      >
        <TabsTrigger
          className={TAB_TRIGGER_CLASS_NAME}
          value="history-finances"
        >
          История и имущество
        </TabsTrigger>
        <TabsTrigger className={TAB_TRIGGER_CLASS_NAME} value="inventory">
          Инвентарь
        </TabsTrigger>
        <TabsTrigger className={TAB_TRIGGER_CLASS_NAME} value="notes">
          Заметки
        </TabsTrigger>
        <TabsTrigger className={TAB_TRIGGER_CLASS_NAME} value="weapons">
          Оружие и атаки
        </TabsTrigger>
      </TabsList>

      <ScrollableTabsContent value="history-finances">
        <HistoryAndFinancesTab backstory={backstory} finances={finances} />
      </ScrollableTabsContent>
      <ScrollableTabsContent value="inventory">
        <InventorySection />
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
