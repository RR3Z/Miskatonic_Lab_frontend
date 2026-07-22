import localizedContent from "@/data/locales/ru/character/detail.ru.json"
import { formatLocalizedTemplate } from "@/data/locales/utils/format-localized-template.util"
import type { D100RollDetails } from "@/lib/api/character-dice-rolls"

type D100RollDetailsComparisonProps = { details: D100RollDetails }

export function D100RollDetailsComparison({
  details,
}: D100RollDetailsComparisonProps) {
  const isBonus = details.mode === "bonus"
  const selectedIndex = details.candidates.indexOf(details.selected)
  const mode = isBonus
    ? localizedContent.copy.detailHeaderDiceResultToastD100RollDetailsComparison
        .preimuschestvo
    : localizedContent.copy.detailHeaderDiceResultToastD100RollDetailsComparison
        .pomeha
  const rule = isBonus
    ? localizedContent.copy.detailHeaderDiceResultToastD100RollDetailsComparison
        .vzyatMenshiiRezultat
    : localizedContent.copy.detailHeaderDiceResultToastD100RollDetailsComparison
        .vzyatBolshiiRezultat
  const accent = isBonus
    ? "text-[var(--ml-accent-success)]"
    : "text-[var(--ml-accent-danger)]"
  const selectedCard = isBonus
    ? "border-[var(--ml-accent-success)] bg-[color-mix(in_srgb,var(--ml-accent-success)_18%,transparent)]"
    : "border-[var(--ml-accent-danger)] bg-[color-mix(in_srgb,var(--ml-accent-danger)_18%,transparent)]"

  return (
    <div className="mt-2 min-w-0" data-testid="d100-roll-details">
      <p
        className={`font-mono text-[0.62rem] font-bold tracking-[0.1em] uppercase ${accent}`}
      >
        {formatLocalizedTemplate(
          localizedContent.copy
            .detailHeaderDiceResultToastD100RollDetailsComparison
            .modeRuleValue0Value1,
          { value0: mode, value1: rule },
        )}
      </p>
      <p className="mt-0.5 font-mono text-[0.62rem] text-[var(--ml-ink-muted)]">
        {formatLocalizedTemplate(
          localizedContent.copy
            .detailHeaderDiceResultToastD100RollDetailsComparison
            .obschayaEdinitsaValue0,
          { value0: details.units },
        )}
      </p>
      <div className="mt-1.5 grid grid-cols-2 gap-1.5">
        {details.candidates.map((candidate, index) => {
          const isSelected = index === selectedIndex
          return (
            <div
              className={`min-w-0 rounded-sm border px-2 py-1.5 ${isSelected ? selectedCard : "border-[var(--ml-border-subtle)] bg-[var(--ml-bg-page)]/35"}`}
              data-testid={`d100-roll-candidate-${index}`}
              key={`${details.tens[index]}-${candidate}-${index}`}
            >
              <span
                className={`block font-mono text-[0.58rem] font-bold tracking-[0.1em] uppercase ${isSelected ? accent : "text-[var(--ml-ink-muted)]"}`}
              >
                {isSelected
                  ? localizedContent.copy
                      .detailHeaderDiceResultToastD100RollDetailsComparison
                      .vzyat
                  : localizedContent.copy
                      .detailHeaderDiceResultToastD100RollDetailsComparison
                      .neVzyat}
              </span>
              <div className="mt-0.5 flex items-end justify-between gap-2">
                <strong
                  className={`font-mono text-xl leading-none font-bold tabular-nums ${isSelected ? accent : "text-[var(--ml-ink-primary)]"}`}
                >
                  {candidate}
                </strong>
                <span className="font-mono text-[0.58rem] text-[var(--ml-ink-muted)]">
                  {formatLocalizedTemplate(
                    localizedContent.copy
                      .detailHeaderDiceResultToastD100RollDetailsComparison
                      .desyatokValue0,
                    { value0: details.tens[index] },
                  )}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
