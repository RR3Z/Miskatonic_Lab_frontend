import { render, screen, within } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { CharacteristicDiceCard } from "@/components/character/detail/header/characteristic-dice-card"
import { DamageBonusRoll } from "@/components/character/detail/header/damage-bonus-roll"
import { SkillDiceCard } from "@/components/character/detail/skills/skill-dice-card"

describe("dice roll cards", () => {
  it("keeps values visible under the progress overlay for every roll type", () => {
    render(
      <>
        <CharacteristicDiceCard
          label="СИЛ"
          onRoll={vi.fn()}
          rolling
          title="Сила"
          value={53}
        />
        <CharacteristicDiceCard
          label="Уклонение"
          onRoll={vi.fn()}
          rolling
          title="Уклонение"
          value={55}
        />
        <SkillDiceCard
          disabledReason={null}
          label="Выживание (10%)"
          onRoll={vi.fn()}
          rolling
          value={10}
        />
        <DamageBonusRoll onRoll={vi.fn()} rolling value="+1d4" />
      </>,
    )

    const strength = screen.getByRole("button", {
      name: "Бросить характеристику Сила",
    })
    const dodge = screen.getByRole("button", {
      name: "Бросить характеристику Уклонение",
    })
    const skill = screen.getByRole("button", {
      name: "Бросить навык Выживание (10%)",
    })
    const damageBonus = screen.getByRole("button", {
      name: "Бросить бонус урона +1d4",
    })

    expect(strength).toBeDisabled()
    expect(dodge).toBeDisabled()
    expect(skill).toBeDisabled()
    expect(damageBonus).toBeDisabled()
    expect(strength).toHaveTextContent("53")
    expect(strength).toHaveTextContent("26")
    expect(strength).toHaveTextContent("10")
    expect(dodge).toHaveTextContent("55")
    expect(dodge).toHaveTextContent("27")
    expect(dodge).toHaveTextContent("11")
    expect(skill).toHaveTextContent("10")
    expect(damageBonus).toHaveTextContent("+1d4")

    for (const card of [strength, dodge, skill, damageBonus]) {
      expect(within(card).getByTestId("dice-roll-progress")).toBeVisible()
      expect(
        within(card).getByRole("status", { name: "Выполняется бросок" }),
      ).toBeVisible()
    }
  })
})
