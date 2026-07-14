import { SectionTitle } from "@/components/character/detail/tabs/section-title"

export function InventoryTab() {
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
