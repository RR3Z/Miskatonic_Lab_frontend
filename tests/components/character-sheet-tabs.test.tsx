import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { CharacterSheetTabs } from "@/components/character/detail/tabs/character-sheet-tabs"
import { characterDetailFixture } from "../fixtures/character-detail"

const mutations = vi.hoisted(() => ({
  createBackstoryItem: { mutateAsync: vi.fn() },
  createNote: { isPending: false, mutateAsync: vi.fn(), reset: vi.fn() },
  deleteBackstory: { mutateAsync: vi.fn() },
  deleteBackstoryItem: { mutateAsync: vi.fn() },
  deleteFinances: { mutateAsync: vi.fn() },
  deleteNote: { mutateAsync: vi.fn() },
  updateBackstoryItem: { mutateAsync: vi.fn() },
  updateFinances: { mutateAsync: vi.fn() },
  updateNote: { mutateAsync: vi.fn() },
  upsertBackstory: { mutateAsync: vi.fn() },
}))

vi.mock("@/lib/api/use-character-notes", () => ({
  useCreateCharacterNote: () => mutations.createNote,
  useDeleteCharacterNote: () => mutations.deleteNote,
  useUpdateCharacterNote: () => mutations.updateNote,
}))

vi.mock("@/lib/api/use-character-backstory", () => ({
  useCreateCharacterBackstoryItem: () => mutations.createBackstoryItem,
  useDeleteCharacterBackstory: () => mutations.deleteBackstory,
  useDeleteCharacterBackstoryItem: () => mutations.deleteBackstoryItem,
  useUpdateCharacterBackstoryItem: () => mutations.updateBackstoryItem,
  useUpsertCharacterBackstory: () => mutations.upsertBackstory,
}))

vi.mock("@/lib/api/use-character-finances", () => ({
  useDeleteCharacterFinances: () => mutations.deleteFinances,
  useUpdateCharacterFinances: () => mutations.updateFinances,
}))

describe("CharacterSheetTabs", () => {
  beforeEach(() => {
    mutations.createNote.isPending = false
    for (const mutation of Object.values(mutations)) {
      mutation.mutateAsync.mockReset()
    }
    mutations.createNote.reset.mockReset()
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
        skills={character.skills}
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
    expect(
      screen.getByText("Истина скрывается в старых архивах."),
    ).toBeVisible()
    expect(screen.getByText("$10")).toBeVisible()
    expect(screen.getByText("$45")).toBeVisible()
    expect(
      screen.getByRole("combobox", { name: "Редактировать кредитный рейтинг" }),
    ).toHaveTextContent("55%")
    expect(screen.getByText("Дом и библиотека редких книг")).toBeVisible()
    expect(screen.getByRole("heading", { name: "Имущество" })).toBeVisible()
    expect(
      screen.queryByRole("heading", { name: "Наличные и активы" }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Редактировать раздел Описание" }),
    ).toBeEnabled()
    expect(
      screen.getByRole("button", {
        name: "Редактировать поле Карманные деньги",
      }),
    ).toBeEnabled()
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

  it("edits biography and finances inline", async () => {
    const user = userEvent.setup()
    const character = characterDetailFixture()

    render(
      <CharacterSheetTabs
        backstory={character.backstory}
        characterId={character.id}
        finances={character.finances}
        notes={character.notes}
        skills={character.skills}
      />,
    )

    await user.click(
      screen.getByRole("button", { name: "Редактировать раздел Описание" }),
    )
    const description = screen.getByRole("textbox", {
      name: "Редактировать раздел Описание",
    })
    await user.clear(description)
    await user.type(description, "Новое описание{Control>}{Enter}{/Control}")

    await waitFor(() =>
      expect(mutations.upsertBackstory.mutateAsync).toHaveBeenCalledWith({
        personal_description: "Новое описание",
      }),
    )

    await user.click(
      screen.getByRole("button", {
        name: "Редактировать поле Карманные деньги",
      }),
    )
    const spendingLimit = screen.getByRole("textbox", {
      name: "Редактировать поле Карманные деньги",
    })
    await user.clear(spendingLimit)
    await user.type(spendingLimit, "$20")
    await user.tab()

    await waitFor(() =>
      expect(mutations.updateFinances.mutateAsync).toHaveBeenCalledWith({
        spending_limit: "$20",
      }),
    )
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
        skills={character.skills}
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
    mutations.createNote.mutateAsync.mockResolvedValue({
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
        skills={character.skills}
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

    expect(mutations.createNote.mutateAsync).toHaveBeenCalledWith({
      body: "Изучить дневник профессора.",
      title: "Следующий шаг",
    })
    expect(
      screen.queryByRole("dialog", { name: "Новая заметка" }),
    ).not.toBeInTheDocument()
  })

  it("edits and deletes an existing note inline", async () => {
    const user = userEvent.setup()
    const character = characterDetailFixture()
    const note = {
      body: "Старый текст",
      character_id: character.id,
      created_at: "2026-01-01T00:00:00Z",
      id: "note-1",
      title: "Старый заголовок",
      updated_at: "2026-01-01T00:00:00Z",
    }

    render(
      <CharacterSheetTabs
        backstory={character.backstory}
        characterId={character.id}
        finances={character.finances}
        notes={[note]}
        skills={character.skills}
      />,
    )

    await user.click(screen.getByRole("tab", { name: "Заметки" }))
    await user.click(
      screen.getByRole("button", {
        name: "Редактировать заголовок заметки Старый заголовок",
      }),
    )
    const title = screen.getByRole("textbox", {
      name: "Редактировать заголовок заметки Старый заголовок",
    })
    await user.clear(title)
    await user.type(title, "Новый заголовок{Enter}")

    await waitFor(() =>
      expect(mutations.updateNote.mutateAsync).toHaveBeenCalledWith({
        body: note.body,
        title: "Новый заголовок",
      }),
    )

    await user.click(
      screen.getByRole("button", { name: "Удалить заметку Старый заголовок" }),
    )
    const dialog = screen.getByRole("alertdialog", {
      name: "Удалить заметку?",
    })
    await user.click(within(dialog).getByRole("button", { name: "Удалить" }))

    await waitFor(() =>
      expect(mutations.deleteNote.mutateAsync).toHaveBeenCalledOnce(),
    )
  })

  it("creates a fixed history section from its text area", async () => {
    const user = userEvent.setup()
    const character = characterDetailFixture()

    render(
      <CharacterSheetTabs
        backstory={character.backstory}
        characterId={character.id}
        finances={character.finances}
        notes={character.notes}
        skills={character.skills}
      />,
    )

    await user.click(
      screen.getByRole("button", { name: "Редактировать раздел Черты" }),
    )
    await user.type(
      screen.getByRole("textbox", { name: "Редактировать раздел Черты" }),
      "Наблюдательный{Control>}{Enter}{/Control}",
    )

    await waitFor(() =>
      expect(mutations.createBackstoryItem.mutateAsync).toHaveBeenCalledWith({
        section: "traits",
        text: "Наблюдательный",
        title: "Черты",
      }),
    )
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
        skills={character.skills}
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
