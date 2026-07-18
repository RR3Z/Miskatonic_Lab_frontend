"use client"

import { PencilLine } from "lucide-react"

import { DeleteResourceButton } from "@/components/character/detail/editors/delete-resource-button"
import { Button } from "@/components/ui/button"
import { useDeleteCharacterInventoryItem } from "@/lib/api/use-character-inventory"
import type { CharacterInventoryItem } from "@/types/character"

export function InventoryItemCard({
  characterId,
  item,
  onEdit,
}: {
  characterId: string
  item: CharacterInventoryItem
  onEdit: () => void
}) {
  const deleteMutation = useDeleteCharacterInventoryItem(characterId, item.id)

  return (
    <article className="rounded-sm border border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel)]/70 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <h3 className="font-heading text-base font-semibold text-[var(--ml-ink-primary)]">
              {item.name}
            </h3>
            {item.quantity ? (
              <span className="font-body text-sm text-[var(--ml-accent-aged-gold)]">
                ×{item.quantity}
              </span>
            ) : null}
            {item.category ? (
              <span className="font-body text-xs text-[var(--ml-ink-muted)]">
                {item.category}
              </span>
            ) : null}
          </div>
          {item.description ? (
            <p className="mt-1 whitespace-pre-wrap font-body text-sm leading-6 text-[var(--ml-ink-muted)]">
              {item.description}
            </p>
          ) : null}
        </div>
        <Button
          aria-label={`Редактировать предмет ${item.name}`}
          onClick={onEdit}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <PencilLine aria-hidden="true" />
        </Button>
        <DeleteResourceButton
          ariaLabel={`Удалить предмет ${item.name}`}
          description={`Предмет «${item.name}» будет удалён без возможности восстановления.`}
          errorMessage="Не удалось удалить предмет"
          onDelete={() => deleteMutation.mutateAsync()}
          title="Удалить предмет?"
          variant="destructive"
        />
      </div>
    </article>
  )
}
