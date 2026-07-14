import { EditableSectionHeader } from "@/components/character/detail/tabs/editable-section-header"
import { FinanceCard } from "@/components/character/detail/tabs/finance-card"
import type { CharacterFinances } from "@/types/character"

export function FinancesSection({ finances }: { finances: CharacterFinances }) {
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
