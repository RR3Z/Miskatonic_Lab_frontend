import { FinancesSection } from "@/components/character/detail/tabs/finances-section"
import { HistorySection } from "@/components/character/detail/tabs/history-section"
import { TooltipProvider } from "@/components/ui/tooltip"
import type { CharacterBackstory, CharacterFinances } from "@/types/character"

export function HistoryFinancesTab({
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
        <HistorySection backstory={backstory} />
        <FinancesSection finances={finances} />
      </div>
    </TooltipProvider>
  )
}
