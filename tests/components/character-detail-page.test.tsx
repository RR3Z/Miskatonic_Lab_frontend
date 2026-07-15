import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type { CharacterDetail } from "@/types/character"
import { characterDetailFixture } from "../fixtures/character-detail"

const queryState = vi.hoisted(() => ({
  data: undefined as CharacterDetail | undefined,
  error: null as unknown,
  isFetching: false,
  isPending: false,
  refetch: vi.fn(),
}))

const resourceMutation = vi.hoisted(() => ({ mutateAsync: vi.fn() }))

vi.mock("@/lib/api/use-characters", () => ({
  useCharacter: () => queryState,
}))

vi.mock("@/lib/api/use-character-notes", () => ({
  useCreateCharacterNote: () => ({
    isPending: false,
    mutateAsync: vi.fn(),
    reset: vi.fn(),
  }),
  useDeleteCharacterNote: () => ({ mutateAsync: vi.fn() }),
  useUpdateCharacterNote: () => ({ mutateAsync: vi.fn() }),
}))

vi.mock("@/lib/api/use-character-backstory", () => ({
  useCreateCharacterBackstoryItem: () => ({ mutateAsync: vi.fn() }),
  useDeleteCharacterBackstory: () => ({ mutateAsync: vi.fn() }),
  useDeleteCharacterBackstoryItem: () => ({ mutateAsync: vi.fn() }),
  useUpdateCharacterBackstoryItem: () => ({ mutateAsync: vi.fn() }),
  useUpsertCharacterBackstory: () => ({ mutateAsync: vi.fn() }),
}))

vi.mock("@/lib/api/use-character-finances", () => ({
  useDeleteCharacterFinances: () => ({ mutateAsync: vi.fn() }),
  useUpdateCharacterFinances: () => ({ mutateAsync: vi.fn() }),
}))

vi.mock("@/lib/api/use-character-profile", () => ({
  useUpdateCharacterPortrait: () => ({
    isPending: false,
    mutateAsync: vi.fn(),
  }),
  useUpdateCharacterProfile: () => ({ mutateAsync: vi.fn() }),
}))

vi.mock("@/lib/api/use-character-statistics", () => ({
  useDeleteCharacterCharacteristics: () => ({ mutateAsync: vi.fn() }),
  useDeleteCharacterDerivedStats: () => ({ mutateAsync: vi.fn() }),
  useUpdateCharacterCharacteristics: () => ({ mutateAsync: vi.fn() }),
  useUpdateCharacterDerivedStats: () => ({ mutateAsync: vi.fn() }),
}))

vi.mock("@/lib/api/use-character-resources", () => ({
  useDeleteCharacterResource: () => ({ mutateAsync: vi.fn() }),
  useUpdateCharacterResource: () => resourceMutation,
}))

vi.mock("@/lib/api/use-character-skills", () => ({
  useDeleteCharacterSkill: () => ({ mutateAsync: vi.fn() }),
}))

import { CharacterDetailPage } from "@/components/character/detail/character-detail-page"

describe("CharacterDetailPage", () => {
  beforeEach(() => {
    setDesktopCharacterSheet(true)
    queryState.data = undefined
    queryState.error = null
    queryState.isFetching = false
    queryState.isPending = false
    queryState.refetch.mockReset()
    resourceMutation.mutateAsync.mockReset()
    resourceMutation.mutateAsync.mockResolvedValue(undefined)
  })

  it("renders the loaded character sheet", () => {
    queryState.data = characterDetailFixture({
      age: 48,
      name: "Артур Кэллахан",
      occupation: "Антиквар",
      sex: "female",
    })

    render(<CharacterDetailPage characterId="character-1" />)

    expect(
      screen.getByRole("heading", { name: "Артур Кэллахан" }),
    ).toBeVisible()
    expect(screen.getByTestId("character-occupation")).toHaveTextContent(
      "Профессия: Антиквар",
    )
    expect(screen.getByTestId("character-age")).toHaveTextContent("Возраст: 48")
    expect(screen.getByTestId("character-sex")).toHaveTextContent(
      "Пол: Женщина",
    )
    expect(screen.queryByText(/^Игрок:/)).not.toBeInTheDocument()
    const resources = screen.getAllByTestId("character-resource")
    expect(resources[0]).toHaveTextContent("6/20")
    expect(resources[1]).toHaveTextContent("15/30")
    const skillsPanel = screen.getByTestId("character-skills-panel")
    const sectionsPanel = screen.getByTestId("character-sections-panel")
    expect(skillsPanel).toBeVisible()
    expect(skillsPanel).toHaveAttribute("data-slot", "scroll-area")
    expect(
      skillsPanel.querySelector('[data-slot="scroll-area-viewport"]'),
    ).toBeInTheDocument()
    expect(sectionsPanel).toBeVisible()
    expect(
      sectionsPanel.querySelector(
        '[role="tabpanel"] [data-slot="scroll-area-viewport"]',
      ),
    ).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Навыки" })).toBeVisible()
    expect(
      screen.getByRole("tab", { name: "История и имущество" }),
    ).toHaveAttribute("aria-selected", "true")
    const separator = screen.getByRole("separator", {
      name: "Изменить ширину панелей листа",
    })
    expect(separator).toBeVisible()
    expect(
      screen.queryByRole("link", { name: "К списку персонажей" }),
    ).not.toBeInTheDocument()
  })

  it("renders a loading skeleton", () => {
    queryState.isPending = true

    render(<CharacterDetailPage characterId="character-1" />)

    expect(screen.getByText("Загрузка листа персонажа…")).toBeInTheDocument()
  })

  it("stacks the workspace below the desktop breakpoint", () => {
    setDesktopCharacterSheet(false)
    queryState.data = characterDetailFixture()

    render(<CharacterDetailPage characterId="character-1" />)

    expect(
      screen.getByTestId("character-sheet-stacked-workspace"),
    ).toBeVisible()
    expect(screen.getByTestId("character-skills-panel")).toBeVisible()
    expect(screen.getByTestId("character-sections-panel")).toBeVisible()
    expect(
      screen.queryByRole("separator", {
        name: "Изменить ширину панелей листа",
      }),
    ).not.toBeInTheDocument()
  })

  it("renders characteristics, derived stats, and character states", () => {
    const baseCharacter = characterDetailFixture()
    queryState.data = characterDetailFixture({
      characteristics: {
        ...baseCharacter.characteristics,
        constitution: 50,
        dexterity: 55,
        education: 70,
        intelligence: 65,
        power: 60,
        size: 75,
        strength: 80,
      },
      derived_stats: {
        ...baseCharacter.derived_stats,
        damage_bonus: "+1d4",
        dodge_value: 27,
        physique: 1,
        speed: 8,
      },
      hp: {
        ...baseCharacter.hp,
        major_wound: true,
      },
      sanity: {
        ...baseCharacter.sanity,
        temp_insanity: true,
      },
    })

    render(<CharacterDetailPage characterId="character-1" />)

    expect(
      screen.getByRole("heading", { name: "Характеристики" }),
    ).toBeVisible()
    expect(screen.getByRole("heading", { name: "Производные" })).toBeVisible()
    expect(screen.getByRole("heading", { name: "Состояния" })).toBeVisible()
    expect(screen.getByTestId("character-sheet-header")).toHaveClass(
      "grid-cols-1",
      "md:grid-cols-2",
      "xl:grid-cols-[minmax(330px,1fr)_1px_minmax(220px,0.95fr)_1px_minmax(125px,0.55fr)_1px_minmax(430px,1.4fr)]",
    )
    expect(screen.getByText("Комплекция")).toHaveClass("w-full", "min-w-0")
    expect(
      screen.getByRole("button", { name: "Редактировать характеристику Сила" }),
    ).toHaveTextContent("80")
    expect(screen.getByText("+1d4")).toBeVisible()
    for (const [title, abbreviation] of [
      ["Сила", "СИЛ"],
      ["Выносливость", "ВЫН"],
      ["Телосложение", "ТЕЛ"],
      ["Ловкость", "ЛВК"],
      ["Наружность", "НАР"],
      ["Интеллект", "ИНТ"],
      ["Мощь", "МОЩ"],
      ["Образование", "ОБР"],
    ]) {
      expect(screen.getByTitle(title)).toHaveTextContent(abbreviation)
    }
    expect(screen.getByTestId("character-state-major-wound")).toHaveAttribute(
      "data-active",
      "true",
    )
    const temporaryInsanity = screen.getByTestId(
      "character-state-temporary-insanity",
    )
    expect(temporaryInsanity).toHaveAttribute("data-active", "true")
    expect(temporaryInsanity).toHaveClass(
      "border-[#3d4f8b]",
      "bg-[#3d4f8b]/20",
      "text-[#7f91d6]",
    )
    expect(screen.getByTestId("character-state-dead")).toHaveAttribute(
      "data-active",
      "false",
    )
    expect(
      screen.getByRole("heading", { level: 3, name: "Здоровье" }),
    ).toBeVisible()
    expect(
      screen.getByRole("heading", { level: 3, name: "Рассудок" }),
    ).toBeVisible()
    for (const state of [
      "Серьёзная рана",
      "Без сознания",
      "При смерти",
      "Мёртв",
      "Временное безумие",
      "Бессрочное безумие",
    ]) {
      expect(
        screen.getByRole("button", {
          name: `Информация о состоянии: ${state}`,
        }),
      ).toBeVisible()
    }
  })

  it.each([
    ["male", "Мужчина"],
    ["female", "Женщина"],
    [null, "—"],
  ])("renders the Russian sex label for %s", (sex, expectedLabel) => {
    queryState.data = characterDetailFixture({ sex })

    render(<CharacterDetailPage characterId="character-1" />)

    expect(screen.getByTestId("character-sex")).toHaveTextContent(
      `Пол: ${expectedLabel}`,
    )
  })

  it("shows the age rulebook tooltip without identity edit icons", async () => {
    const user = userEvent.setup()
    queryState.data = characterDetailFixture({ age: 42 })

    render(<CharacterDetailPage characterId="character-1" />)

    expect(
      screen
        .getByRole("button", { name: "Редактировать имя персонажа" })
        .querySelector("svg"),
    ).not.toBeInTheDocument()
    expect(
      screen
        .getByRole("button", { name: "Редактировать поле Профессия" })
        .querySelector("svg"),
    ).not.toBeInTheDocument()

    const ageInfo = screen.getByRole("button", {
      name: "Информация о возрастных модификаторах",
    })
    await user.hover(ageInfo)

    const tooltip = await waitFor(() => {
      const element = document.querySelector<HTMLElement>(
        '[data-slot="tooltip-content"]:not([data-state="closed"])',
      )
      expect(element).toBeVisible()
      return element as HTMLElement
    })

    expect(tooltip).toHaveTextContent("Возраст: модификаторы")
    expect(tooltip).toHaveTextContent("15–19")
    expect(tooltip).toHaveTextContent("80–89")
    expect(tooltip).toHaveTextContent("Проверка улучшения ОБР")
    expect(tooltip).toHaveTextContent(
      "Система не применяет возрастные модификаторы автоматически.",
    )

    await user.unhover(ageInfo)
    ageInfo.focus()
    expect(ageInfo).toHaveFocus()
    await waitFor(() => {
      expect(
        document.querySelector(
          '[data-slot="tooltip-content"]:not([data-state="closed"])',
        ),
      ).toBeVisible()
    })
  })

  it("renders missing values without hiding zeroes", () => {
    const baseCharacter = characterDetailFixture()
    queryState.data = characterDetailFixture({
      age: null,
      characteristics: {
        ...baseCharacter.characteristics,
        strength: 0,
      },
      sex: null,
    })

    render(<CharacterDetailPage characterId="character-1" />)

    expect(screen.getByTestId("character-age")).toHaveTextContent("Возраст: —")
    expect(screen.getByTestId("character-sex")).toHaveTextContent("Пол: —")
    expect(screen.getByTitle("Сила")).toHaveTextContent("0")
    expect(screen.getByTitle("Выносливость")).toHaveTextContent("—")
  })

  it("renders resources in order with shared background icons", () => {
    queryState.data = characterDetailFixture()

    render(<CharacterDetailPage characterId="character-1" />)

    const resourceGrid = screen.getByTestId("character-resource-grid")
    const resources = within(resourceGrid).getAllByTestId("character-resource")
    expect(resources.map((resource) => resource.textContent)).toEqual([
      "Здоровье6/20",
      "Рассудок15/30",
      "Магия9/25",
      "Удача80/100",
    ])
    const icons = within(resourceGrid).getAllByTestId("character-resource-icon")
    expect(icons).toHaveLength(4)
    for (const icon of icons) expect(icon).toHaveClass("opacity-[0.16]")
  })

  it("shows state rules on hover and keyboard focus", async () => {
    const user = userEvent.setup()
    queryState.data = characterDetailFixture()

    render(<CharacterDetailPage characterId="character-1" />)

    const majorWoundInfo = screen.getByRole("button", {
      name: "Информация о состоянии: Серьёзная рана",
    })
    await user.hover(majorWoundInfo)
    const hoverTooltip = await waitFor(() => {
      const tooltip = document.querySelector<HTMLElement>(
        '[data-slot="tooltip-content"]:not([data-state="closed"])',
      )
      expect(tooltip).toBeVisible()
      return tooltip as HTMLElement
    })
    const hoverText = Array.from(hoverTooltip.children).map(
      (element) => element.textContent,
    )
    expect(hoverText).toContain(
      "Как получить: Одна атака наносит урон, равный или превышающий половину максимального здоровья.",
    )
    expect(hoverText).toContain("Книга хранителя, глава 6 «Бой», стр. 118.")

    await user.unhover(majorWoundInfo)
    majorWoundInfo.focus()
    expect(majorWoundInfo).toHaveFocus()
    const focusTooltip = await waitFor(() => {
      const tooltip = document.querySelector<HTMLElement>(
        '[data-slot="tooltip-content"]:not([data-state="closed"])',
      )
      expect(tooltip).toBeVisible()
      return tooltip as HTMLElement
    })
    expect(
      Array.from(focusTooltip.children).map((element) => element.textContent),
    ).toContain("Опасное повреждение, способное привести к смерти.")
  })

  it("persists character state toggles", async () => {
    const user = userEvent.setup()
    queryState.data = characterDetailFixture()

    render(<CharacterDetailPage characterId="character-1" />)

    const state = screen.getByTestId("character-state-major-wound")
    const toggle = screen.getByRole("button", { name: "Серьёзная рана" })
    expect(toggle).toHaveAttribute("aria-pressed", "false")
    expect(state).toHaveAttribute("data-active", "false")

    await user.click(toggle)

    expect(toggle).toHaveAttribute("aria-pressed", "true")
    expect(state).toHaveAttribute("data-active", "true")
    expect(resourceMutation.mutateAsync).toHaveBeenLastCalledWith({
      resource: "hp",
      values: { major_wound: true },
    })

    await user.click(toggle)

    expect(toggle).toHaveAttribute("aria-pressed", "false")
    expect(state).toHaveAttribute("data-active", "false")
    expect(resourceMutation.mutateAsync).toHaveBeenLastCalledWith({
      resource: "hp",
      values: { major_wound: false },
    })
  })

  it("rolls back a character state when persistence fails", async () => {
    const user = userEvent.setup()
    queryState.data = characterDetailFixture()
    resourceMutation.mutateAsync.mockRejectedValueOnce(
      new Error("network failed"),
    )

    render(<CharacterDetailPage characterId="character-1" />)

    const state = screen.getByTestId("character-state-major-wound")
    const toggle = screen.getByRole("button", { name: "Серьёзная рана" })
    await user.click(toggle)

    expect(resourceMutation.mutateAsync).toHaveBeenCalledWith({
      resource: "hp",
      values: { major_wound: true },
    })
    await waitFor(() => {
      expect(toggle).toHaveAttribute("aria-pressed", "false")
      expect(state).toHaveAttribute("data-active", "false")
      expect(toggle).toBeEnabled()
    })
  })

  it("renders the not-found state for a 404 response", () => {
    queryState.error = { response: new Response(null, { status: 404 }) }

    render(<CharacterDetailPage characterId="missing" />)

    expect(screen.getByText("Персонаж не найден")).toBeVisible()
    expect(
      screen.getByRole("link", { name: "К списку персонажей" }),
    ).toHaveAttribute("href", "/characters")
  })

  it("retries a recoverable loading error", async () => {
    const user = userEvent.setup()
    queryState.error = new Error("network failed")
    queryState.refetch.mockResolvedValue(undefined)

    render(<CharacterDetailPage characterId="character-1" />)
    await user.click(screen.getByRole("button", { name: "Повторить" }))

    expect(queryState.refetch).toHaveBeenCalledOnce()
  })
})

function setDesktopCharacterSheet(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation(
    (query: string) =>
      ({
        addEventListener: vi.fn(),
        matches: query === "(min-width: 1280px)" ? matches : false,
        media: query,
        removeEventListener: vi.fn(),
      }) as unknown as MediaQueryList,
  )
}
