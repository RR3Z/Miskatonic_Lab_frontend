import { SHEET_CARD_CLASS_NAME } from "@/components/character/detail/tabs/styles/sheet-card.styles"

export function FinanceCard({
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
