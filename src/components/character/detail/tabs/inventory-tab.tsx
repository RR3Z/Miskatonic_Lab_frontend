"use client"

import { Plus } from "lucide-react"
import { useMemo, useState } from "react"

import { InventoryItemCard } from "@/components/character/detail/inventory/inventory-item-card"
import { InventoryItemDialog } from "@/components/character/detail/inventory/inventory-item-dialog"
import { EmptySection } from "@/components/character/detail/tabs/empty-section"
import { SectionTitle } from "@/components/character/detail/tabs/section-title"
import { Button } from "@/components/ui/button"
import type { CharacterInventoryItem } from "@/types/character"

export function InventoryTab({
  characterId,
  inventory,
}: {
  characterId: string
  inventory: CharacterInventoryItem[] | null
}) {
  const [isCreating, setIsCreating] = useState(false)
  const [editingItem, setEditingItem] = useState<CharacterInventoryItem | null>(
    null,
  )
  const categorySuggestions = useMemo(
    () =>
      [
        ...new Set(
          inventory?.flatMap((item) =>
            item.category ? [item.category] : [],
          ) ?? [],
        ),
      ].sort((left, right) => left.localeCompare(right, "ru")),
    [inventory],
  )

  return (
    <section data-testid="character-inventory-content">
      <div className="flex items-center justify-between gap-4">
        <SectionTitle>Инвентарь</SectionTitle>
        <Button
          className="shrink-0 border-[var(--ml-accent-brass-strong)]/70 bg-[color-mix(in_srgb,var(--ml-accent-brass-strong)_10%,transparent)] text-[var(--ml-accent-aged-gold)] hover:border-[var(--ml-accent-aged-gold)] hover:bg-[color-mix(in_srgb,var(--ml-accent-brass-strong)_20%,transparent)] hover:text-[var(--ml-ink-primary)]"
          disabled={isCreating || editingItem !== null}
          onClick={() => setIsCreating(true)}
          size="sm"
          type="button"
          variant="secondary"
        >
          <Plus aria-hidden="true" data-icon="inline-start" />
          Добавить предмет
        </Button>
      </div>

      <InventoryItemDialog
        categorySuggestions={categorySuggestions}
        characterId={characterId}
        onOpenChange={setIsCreating}
        open={isCreating}
      />
      {editingItem ? (
        <InventoryItemDialog
          categorySuggestions={categorySuggestions}
          characterId={characterId}
          item={editingItem}
          key={editingItem.id}
          onOpenChange={(open) => {
            if (!open) setEditingItem(null)
          }}
          open
        />
      ) : null}

      {inventory?.length ? (
        <div className="mt-3 grid gap-3" data-testid="character-inventory-list">
          {inventory.map((item) => (
            <InventoryItemCard
              characterId={characterId}
              item={item}
              key={item.id}
              onEdit={() => setEditingItem(item)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-3">
          <EmptySection>Предметов пока нет.</EmptySection>
        </div>
      )}
    </section>
  )
}
