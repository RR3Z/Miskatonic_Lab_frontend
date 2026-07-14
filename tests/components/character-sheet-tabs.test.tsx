import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { CharacterSheetTabs } from "@/components/character/detail/tabs/character-sheet-tabs"
import { characterDetailFixture } from "../fixtures/character-detail"

const noteMutation = vi.hoisted(() => ({
  isPending: false,
  mutateAsync: vi.fn(),
  reset: vi.fn(),
}))

vi.mock("@/lib/api/use-characters", () => ({
  useCreateCharacterNote: () => noteMutation,
}))

describe("CharacterSheetTabs", () => {
  beforeEach(() => {
    noteMutation.isPending = false
    noteMutation.mutateAsync.mockReset()
    noteMutation.reset.mockReset()
  })

  it("renders history and finances together in the initially selected tab", () => {
    const character = characterDetailFixture()

    render(
      <CharacterSheetTabs
        backstory={{
          ...character.backstory,
          items: [
            {
              created_at: "2026-01-01T00:00:00Z",
              id: "backstory-1",
              section: "ideology_beliefs",
              text: "Истина скрывается в старых архивах.",
              title: "Рационалист",
              updated_at: "2026-01-01T00:00:00Z",
            },
          ],
          personal_description: "Высокий мужчина в строгом костюме.",
        }}
        characterId={character.id}
        finances={{
          ...character.finances,
          assets: "Дом и библиотека редких книг",
          cash: "$45",
          credit_rating: {
            base_value: 0,
            category: "Общение",
            checked: false,
            created_at: "2026-01-01T00:00:00Z",
            id: "credit-rating",
            name: "Кредитный рейтинг",
            specialized: false,
            specialty: null,
            updated_at: "2026-01-01T00:00:00Z",
            value: 55,
          },
          spending_limit: "$10",
        }}
        notes={character.notes}
      />,
    )

    const combinedTab = screen.getByRole("tab", {
      name: "История и имущество",
    })
    expect(combinedTab).toHaveAttribute("aria-selected", "true")
    expect(combinedTab).toHaveClass(
      "h-full",
      "items-center",
      "border-0",
      "cursor-pointer",
      "group-data-horizontal/tabs:after:bottom-0",
      "after:z-10",
      "after:bg-[var(--ml-accent-brass-strong)]",
    )
    expect(screen.getByRole("tablist")).toHaveClass(
      "relative",
      "h-10",
      "border-b",
      "overflow-visible",
    )
    expect(
      screen
        .getByRole("tabpanel")
        .querySelector('[data-slot="scroll-area-viewport"]'),
    ).toBeInTheDocument()
    expect(screen.getAllByRole("tab").map((tab) => tab.textContent)).toEqual([
      "История и имущество",
      "Инвентарь",
      "Заметки",
      "Оружие и атаки",
    ])
    expect(
      screen.queryByRole("tab", { name: "Имущество" }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Биография" })).toBeVisible()
    expect(screen.getByText("Описание")).toBeVisible()
    expect(screen.getByText("Высокий мужчина в строгом костюме.")).toBeVisible()
    expect(screen.getByText("Идеалы и принципы")).toBeVisible()
    expect(screen.getByText("Рационалист")).toBeVisible()
    expect(
      screen.getByText("Истина скрывается в старых архивах."),
    ).toBeVisible()
    expect(screen.getByText("$10")).toBeVisible()
    expect(screen.getByText("$45")).toBeVisible()
    expect(screen.getByText("55%")).toBeVisible()
    expect(screen.getByText("Дом и библиотека редких книг")).toBeVisible()
    expect(screen.getByRole("heading", { name: "Имущество" })).toBeVisible()
    expect(
      screen.queryByRole("heading", { name: "Наличные и активы" }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Редактировать биографию" }),
    ).toHaveAttribute("aria-disabled", "true")
    expect(
      screen.getByRole("button", { name: "Редактировать имущество" }),
    ).toHaveAttribute("aria-disabled", "true")
    const financeCards = screen.getAllByTestId("finance-card")
    expect(financeCards).toHaveLength(4)
    expect(
      financeCards.map(
        (card) => within(card).getByRole("heading", { level: 3 }).textContent,
      ),
    ).toEqual(["Карманные деньги", "Наличные", "Кредитный рейтинг", "Активы"])
    expect(financeCards[2]).toHaveClass("col-span-2")
    expect(financeCards[3]).toHaveClass("col-span-2", "min-h-32")
    expect(
      screen.queryByTestId("character-inventory-content"),
    ).not.toBeInTheDocument()
    expect(
      screen
        .getAllByTestId("backstory-section")
        .map(
          (section) =>
            within(section).getByRole("heading", { level: 3 }).textContent,
        ),
    ).toEqual([
      "Описание",
      "Черты",
      "Идеалы и принципы",
      "Травмы и шрамы",
      "Значимые люди",
      "Фобии и мании",
      "Важные места",
      "Магические книги, заклинания, артефакты",
      "Ценное имущество",
      "Встречи со сверхъестественным",
    ])
  })

  it("explains future biography and property editing on hover and focus", async () => {
    const user = userEvent.setup()
    const character = characterDetailFixture()

    render(
      <CharacterSheetTabs
        backstory={character.backstory}
        characterId={character.id}
        finances={character.finances}
        notes={character.notes}
      />,
    )

    const biographyEdit = screen.getByRole("button", {
      name: "Редактировать биографию",
    })
    const financesEdit = screen.getByRole("button", {
      name: "Редактировать имущество",
    })

    expect(biographyEdit).toHaveAttribute("tabindex", "0")
    expect(biographyEdit).toHaveAttribute("aria-disabled", "true")
    expect(financesEdit).toHaveAttribute("aria-disabled", "true")

    await user.hover(biographyEdit)
    expect(
      await screen.findByText(
        "Редактирование биографии будет добавлено позже",
        { selector: '[data-slot="tooltip-content"]' },
      ),
    ).toBeVisible()

    await user.unhover(biographyEdit)
    financesEdit.focus()
    expect(
      await screen.findByText(
        "Редактирование имущества будет добавлено позже",
        { selector: '[data-slot="tooltip-content"]' },
      ),
    ).toBeVisible()
  })

  it("switches between inventory, notes, and the backend placeholder", async () => {
    const user = userEvent.setup()
    const character = characterDetailFixture()

    render(
      <CharacterSheetTabs
        backstory={character.backstory}
        characterId={character.id}
        finances={character.finances}
        notes={[
          {
            body: "Проверить архив газеты за 1918 год.",
            character_id: character.id,
            created_at: "2026-01-01T00:00:00Z",
            id: "note-1",
            title: "Зацепка",
            updated_at: "2026-01-01T00:00:00Z",
          },
        ]}
      />,
    )

    await user.click(screen.getByRole("tab", { name: "Инвентарь" }))
    expect(screen.getByTestId("character-inventory-content")).toHaveTextContent(
      "Сохранение инвентаря пока не поддерживается Backend-моделью персонажа.",
    )

    await user.click(screen.getByRole("tab", { name: "Заметки" }))
    expect(screen.getByText("Зацепка")).toBeVisible()
    expect(
      screen.getByText("Проверить архив газеты за 1918 год."),
    ).toBeVisible()

    await user.click(screen.getByRole("tab", { name: "Оружие и атаки" }))
    expect(
      screen.getByText(
        "Оружие и атаки пока не поддерживаются Backend-моделью персонажа.",
      ),
    ).toBeVisible()
  })

  it("creates a note from the notes tab", async () => {
    const user = userEvent.setup()
    const character = characterDetailFixture()
    noteMutation.mutateAsync.mockResolvedValue({
      body: "Изучить дневник профессора.",
      character_id: character.id,
      created_at: "2026-01-01T00:00:00Z",
      id: "note-new",
      title: "Следующий шаг",
      updated_at: "2026-01-01T00:00:00Z",
    })

    render(
      <CharacterSheetTabs
        backstory={character.backstory}
        characterId={character.id}
        finances={character.finances}
        notes={null}
      />,
    )

    await user.click(screen.getByRole("tab", { name: "Заметки" }))
    await user.click(screen.getByRole("button", { name: "Добавить заметку" }))
    await user.type(screen.getByLabelText("Заголовок"), "  Следующий шаг  ")
    await user.type(
      screen.getByLabelText("Текст"),
      "  Изучить дневник профессора.  ",
    )
    await user.click(screen.getByRole("button", { name: "Добавить" }))

    expect(noteMutation.mutateAsync).toHaveBeenCalledWith({
      body: "Изучить дневник профессора.",
      title: "Следующий шаг",
    })
    expect(
      screen.queryByRole("dialog", { name: "Новая заметка" }),
    ).not.toBeInTheDocument()
  })

  it("supports keyboard tab navigation and empty states", async () => {
    const user = userEvent.setup()
    const character = characterDetailFixture()

    render(
      <CharacterSheetTabs
        backstory={character.backstory}
        characterId={character.id}
        finances={character.finances}
        notes={null}
      />,
    )

    expect(screen.getAllByTestId("backstory-section")).toHaveLength(10)
    const combinedTab = screen.getByRole("tab", {
      name: "История и имущество",
    })
    combinedTab.focus()
    await user.keyboard("{ArrowRight}{Enter}")

    expect(screen.getByRole("tab", { name: "Инвентарь" })).toHaveAttribute(
      "aria-selected",
      "true",
    )
    expect(screen.getByTestId("character-inventory-content")).toBeVisible()

    await user.keyboard("{ArrowRight}{Enter}")

    expect(screen.getByRole("tab", { name: "Заметки" })).toHaveAttribute(
      "aria-selected",
      "true",
    )
    expect(screen.getByText("Заметок пока нет.")).toBeVisible()
  })
})
