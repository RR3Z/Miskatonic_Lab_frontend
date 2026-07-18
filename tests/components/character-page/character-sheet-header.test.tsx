import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { characterDetailFixture } from "@tests/fixtures/character-detail"
import { setTestViewport } from "@tests/utils/viewport.util"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { CharacterSheetHeader } from "@/components/character/detail/header/character-sheet-header"

const mutations = vi.hoisted(() => ({
  deleteCharacteristics: { mutateAsync: vi.fn() },
  deleteResource: { mutateAsync: vi.fn() },
  portrait: { isPending: false, mutateAsync: vi.fn() },
  profile: { mutateAsync: vi.fn() },
  resource: { mutateAsync: vi.fn() },
  updateCharacteristics: { mutateAsync: vi.fn() },
}))
const diceMutation = vi.hoisted(() => ({
  isPending: false,
  mutateAsync: vi.fn(),
}))
const toastMocks = vi.hoisted(() => Object.assign(vi.fn(), { error: vi.fn() }))

vi.mock("sonner", () => ({ toast: toastMocks }))

vi.mock("@/lib/api/use-character-profile", () => ({
  useUpdateCharacterPortrait: () => mutations.portrait,
  useUpdateCharacterProfile: () => mutations.profile,
}))

vi.mock("@/lib/api/use-character-dice-rolls", () => ({
  useMakeCharacterDiceRoll: () => diceMutation,
}))

vi.mock("@/lib/api/use-character-statistics", () => ({
  useDeleteCharacterCharacteristics: () => mutations.deleteCharacteristics,
  useUpdateCharacterCharacteristics: () => mutations.updateCharacteristics,
}))

vi.mock("@/lib/api/use-character-resources", () => ({
  useDeleteCharacterResource: () => mutations.deleteResource,
  useUpdateCharacterResource: () => mutations.resource,
}))

describe("CharacterSheetHeader", () => {
  beforeEach(() => {
    setTestViewport(1024)
    diceMutation.mutateAsync.mockReset()
    diceMutation.mutateAsync.mockResolvedValue({ result: 42 })
    toastMocks.mockReset()
    toastMocks.error.mockReset()
    for (const mutation of Object.values(mutations)) {
      mutation.mutateAsync.mockReset()
      mutation.mutateAsync.mockResolvedValue(undefined)
    }
  })

  it("shows a profile save failure through Sonner", async () => {
    const user = userEvent.setup()
    mutations.profile.mutateAsync.mockRejectedValueOnce(
      new Error("network failed"),
    )
    render(<CharacterSheetHeader character={characterDetailFixture()} />)

    await user.click(
      screen.getByRole("button", { name: "Редактировать поле Профессия" }),
    )
    const input = screen.getByRole("textbox", {
      name: "Редактировать поле Профессия",
    })
    await user.clear(input)
    await user.type(input, "Архивист{Enter}")

    await waitFor(() =>
      expect(toastMocks.error).toHaveBeenCalledWith(
        "Не удалось сохранить личные данные",
      ),
    )
    expect(
      screen.queryByText("Не удалось сохранить личные данные"),
    ).not.toBeInTheDocument()
  })

  it("updates the name with a single-field profile patch", async () => {
    const user = userEvent.setup()
    const character = characterDetailFixture({
      age: 48,
      birthplace: "Бостон",
      sex: "male",
    })
    render(<CharacterSheetHeader character={character} />)

    await user.click(
      screen.getByRole("button", { name: "Редактировать имя персонажа" }),
    )
    const input = screen.getByRole("textbox", {
      name: "Редактировать имя персонажа",
    })
    await user.clear(input)
    await user.type(input, "Генри Армитедж{Enter}")

    await waitFor(() =>
      expect(mutations.profile.mutateAsync).toHaveBeenCalledWith({
        name: "Генри Армитедж",
      }),
    )
  })

  it("accepts only digits for age and saves an empty age as null", async () => {
    const user = userEvent.setup()
    const character = characterDetailFixture({ age: 48 })
    render(<CharacterSheetHeader character={character} />)

    await user.click(
      screen.getByRole("button", { name: "Редактировать поле Возраст" }),
    )
    const input = screen.getByRole("textbox", {
      name: "Редактировать поле Возраст",
    })
    expect(input).toHaveAttribute("inputmode", "numeric")
    expect(input).toHaveAttribute("pattern", "[0-9]*")

    await user.clear(input)
    await user.type(input, "12years3{Enter}")

    await waitFor(() =>
      expect(mutations.profile.mutateAsync).toHaveBeenCalledWith({ age: 123 }),
    )

    mutations.profile.mutateAsync.mockClear()
    await user.click(
      screen.getByRole("button", { name: "Редактировать поле Возраст" }),
    )
    const emptyInput = screen.getByRole("textbox", {
      name: "Редактировать поле Возраст",
    })
    await user.clear(emptyInput)
    await user.keyboard("{Enter}")

    await waitFor(() =>
      expect(mutations.profile.mutateAsync).toHaveBeenCalledWith({ age: null }),
    )
  })

  it("upserts a characteristic without clearing the other values", async () => {
    const user = userEvent.setup()
    const character = characterDetailFixture({
      characteristics: {
        ...characterDetailFixture().characteristics,
        constitution: 40,
        strength: 50,
      },
    })
    render(<CharacterSheetHeader character={character} />)

    await user.click(
      screen.getByRole("button", { name: "Редактировать характеристику Сила" }),
    )
    const input = screen.getByRole("textbox", {
      name: "Редактировать характеристику Сила",
    })
    await user.clear(input)
    await user.type(input, "60{Enter}")

    await waitFor(() =>
      expect(mutations.updateCharacteristics.mutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({ constitution: 40, strength: 60 }),
      ),
    )
  })

  it("shows an invalid numeric characteristic through Sonner", async () => {
    const user = userEvent.setup()
    render(<CharacterSheetHeader character={characterDetailFixture()} />)

    await user.click(
      screen.getByRole("button", { name: "Редактировать характеристику Сила" }),
    )
    const input = screen.getByRole("textbox", {
      name: "Редактировать характеристику Сила",
    })
    await user.clear(input)
    await user.type(input, "-1{Enter}")

    expect(mutations.updateCharacteristics.mutateAsync).not.toHaveBeenCalled()
    expect(toastMocks.error).toHaveBeenCalledWith(
      "Введите целое неотрицательное число",
    )
    expect(
      screen.queryByText("Введите целое неотрицательное число"),
    ).not.toBeInTheDocument()
  })

  it("shows desktop characteristic thresholds and saves all values from the editor dialog", async () => {
    const user = userEvent.setup()
    setTestViewport(1280)
    const base = characterDetailFixture()
    const character = characterDetailFixture({
      characteristics: {
        ...base.characteristics,
        appearance: 40,
        constitution: 45,
        dexterity: 55,
        education: 70,
        intelligence: 65,
        power: 60,
        size: 75,
        strength: 53,
      },
    })
    render(<CharacterSheetHeader character={character} />)

    const strengthCard = screen.getByTestId("characteristic-card-СИЛ")
    expect(strengthCard).toHaveTextContent("53")
    expect(strengthCard).toHaveTextContent("26")
    expect(strengthCard).toHaveTextContent("10")
    expect(strengthCard).toHaveClass("grid-cols-[minmax(0,1fr)_auto]")

    const editButton = screen.getByRole("button", {
      name: "Редактировать характеристики",
    })
    expect(editButton).toHaveAttribute("title", "Изменить")
    expect(editButton).toHaveClass(
      "size-6",
      "border-[var(--ml-accent-brass-strong)]/70",
      "text-[var(--ml-accent-brass-strong)]",
    )
    await user.click(editButton)

    const strengthInput = screen.getByRole("textbox", { name: "Сила" })
    expect(strengthInput).toHaveValue("53")
    await user.clear(strengthInput)
    await user.type(strengthInput, "60")
    await user.click(screen.getByRole("button", { name: "Сохранить" }))

    await waitFor(() =>
      expect(mutations.updateCharacteristics.mutateAsync).toHaveBeenCalledWith({
        appearance: 40,
        constitution: 45,
        dexterity: 55,
        education: 70,
        intelligence: 65,
        power: 60,
        size: 75,
        strength: 60,
      }),
    )
  })

  it("rolls only the clicked characteristic and sends its result to the dice toaster", async () => {
    const user = userEvent.setup()
    setTestViewport(1280)
    const base = characterDetailFixture()
    const character = characterDetailFixture({
      characteristics: {
        ...base.characteristics,
        constitution: 40,
        strength: 53,
      },
    })
    render(<CharacterSheetHeader character={character} />)

    const strengthCard = screen.getByRole("button", {
      name: "Бросить характеристику Сила",
    })
    const constitutionCard = screen.getByRole("button", {
      name: "Бросить характеристику Выносливость",
    })
    let resolveRoll: (result: { result: number }) => void = () => undefined
    diceMutation.mutateAsync.mockImplementationOnce(
      () =>
        new Promise<{ result: number }>((resolve) => {
          resolveRoll = resolve
        }),
    )
    await user.click(strengthCard)

    await waitFor(() =>
      expect(diceMutation.mutateAsync).toHaveBeenCalledTimes(1),
    )
    expect(diceMutation.mutateAsync).toHaveBeenCalledWith({
      expression: "1d100",
      d100Mode: "normal",
    })
    expect(strengthCard).toBeDisabled()
    expect(constitutionCard).not.toBeDisabled()
    expect(strengthCard).toHaveTextContent("53")
    expect(strengthCard).toHaveTextContent("26")
    expect(strengthCard).toHaveTextContent("10")
    expect(within(strengthCard).getByTestId("dice-roll-progress")).toBeVisible()
    expect(
      within(strengthCard).getByRole("status", {
        name: "Выполняется бросок",
      }),
    ).toBeVisible()
    expect(
      within(constitutionCard).queryByTestId("dice-roll-progress"),
    ).not.toBeInTheDocument()
    resolveRoll({ result: 42 })

    await waitFor(() => expect(strengthCard).not.toBeDisabled())
    expect(
      within(strengthCard).queryByTestId("dice-roll-progress"),
    ).not.toBeInTheDocument()
    expect(toastMocks).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        classNames: expect.objectContaining({
          toast: expect.stringContaining("dice-roll-toast"),
        }),
        duration: 30000,
        style: { "--dice-roll-border-color": "#537653" },
        toasterId: "dice-results",
      }),
    )
  })

  it("selects bonus and penalty d100 modes from the characteristic menu", async () => {
    const user = userEvent.setup()
    setTestViewport(1280)
    const base = characterDetailFixture()
    render(
      <CharacterSheetHeader
        character={characterDetailFixture({
          characteristics: { ...base.characteristics, strength: 53 },
        })}
      />,
    )

    const strengthCard = screen.getByTestId("characteristic-card-СИЛ")
    fireEvent.contextMenu(strengthCard)
    expect(await screen.findByText("Броски")).toBeVisible()
    const bonusRoll = await screen.findByText("Бросок с преимуществом")
    expect(bonusRoll).toHaveClass("text-[var(--ml-accent-success)]")
    await user.click(bonusRoll)

    await waitFor(() =>
      expect(diceMutation.mutateAsync).toHaveBeenCalledWith({
        expression: "1d100",
        d100Mode: "bonus",
      }),
    )

    fireEvent.contextMenu(strengthCard)
    const penaltyRoll = await screen.findByText("Бросок с помехой")
    expect(penaltyRoll).toHaveClass("text-[var(--ml-accent-danger)]")
    await user.click(penaltyRoll)

    await waitFor(() =>
      expect(diceMutation.mutateAsync).toHaveBeenLastCalledWith({
        expression: "1d100",
        d100Mode: "penalty",
      }),
    )
  })

  it("rolls a dice damage bonus and shows a neutral dice toast", async () => {
    const user = userEvent.setup()
    const base = characterDetailFixture()
    const character = characterDetailFixture({
      derived_stats: {
        ...base.derived_stats,
        damage_bonus: "+1d4",
      },
    })
    diceMutation.mutateAsync.mockResolvedValueOnce({
      expression: "+1d4",
      result: 3,
    })
    render(<CharacterSheetHeader character={character} />)

    await user.click(
      screen.getByRole("button", { name: "Бросить бонус урона +1d4" }),
    )

    await waitFor(() =>
      expect(diceMutation.mutateAsync).toHaveBeenCalledWith("+1d4"),
    )
    expect(toastMocks).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        duration: 30000,
        style: { "--dice-roll-border-color": "#b6a367" },
        toasterId: "dice-results",
      }),
    )
  })

  it("does not roll a numeric damage bonus", async () => {
    const user = userEvent.setup()
    const base = characterDetailFixture()
    const character = characterDetailFixture({
      derived_stats: {
        ...base.derived_stats,
        damage_bonus: "-1",
      },
    })
    render(<CharacterSheetHeader character={character} />)

    const damageBonus = screen.getByTestId("damage-bonus-stat")
    expect(damageBonus).not.toHaveAttribute("role", "button")
    await user.click(damageBonus)

    expect(diceMutation.mutateAsync).not.toHaveBeenCalled()
  })

  it("keeps derived stats read-only even when the backend row exists", () => {
    const base = characterDetailFixture()
    const character = characterDetailFixture({
      derived_stats: {
        ...base.derived_stats,
        id: "derived-1",
        physique: 1,
        speed: 8,
      },
    })
    render(<CharacterSheetHeader character={character} />)

    expect(
      screen.queryByRole("button", { name: "Удалить производные показатели" }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole("button", {
        name: "Редактировать показатель Скорость",
      }),
    ).not.toBeInTheDocument()
    expect(screen.getByTestId("derived-stat-Скорость")).toHaveTextContent("8")
    expect(screen.getByTestId("derived-stat-Комплекция")).toHaveTextContent("1")
  })

  it("rolls dodge as a d100 characteristic check", async () => {
    const user = userEvent.setup()
    const base = characterDetailFixture()
    const character = characterDetailFixture({
      derived_stats: {
        ...base.derived_stats,
        dodge_value: 55,
      },
    })
    diceMutation.mutateAsync.mockResolvedValueOnce({ result: 20 })
    render(<CharacterSheetHeader character={character} />)

    const dodgeCard = screen.getByRole("button", {
      name: "Бросить характеристику Уклонение",
    })
    expect(within(dodgeCard).getByText("Уклонение")).toHaveClass(
      "whitespace-nowrap",
      "text-[0.55rem]",
      "tracking-[0.04em]",
    )
    expect(dodgeCard).toHaveTextContent("55")
    expect(dodgeCard).toHaveTextContent("27")
    expect(dodgeCard).toHaveTextContent("11")

    await user.click(dodgeCard)

    await waitFor(() =>
      expect(diceMutation.mutateAsync).toHaveBeenCalledWith({
        expression: "1d100",
        d100Mode: "normal",
      }),
    )
    expect(toastMocks).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        style: { "--dice-roll-border-color": "#71846c" },
        toasterId: "dice-results",
      }),
    )
  })

  it("does not request a roll for an unfilled characteristic", async () => {
    const user = userEvent.setup()
    setTestViewport(1280)
    render(<CharacterSheetHeader character={characterDetailFixture()} />)

    const emptyStrengthCard = screen.getByTestId("characteristic-card-СИЛ")
    expect(emptyStrengthCard).not.toHaveAttribute("role", "button")

    await user.click(emptyStrengthCard)

    expect(diceMutation.mutateAsync).not.toHaveBeenCalled()
    expect(toastMocks).not.toHaveBeenCalled()
  })

  it("unlocks the card and uses the normal error toast when a roll fails", async () => {
    const user = userEvent.setup()
    setTestViewport(1280)
    diceMutation.mutateAsync.mockRejectedValueOnce(new Error("network failed"))
    const base = characterDetailFixture()
    const character = characterDetailFixture({
      characteristics: {
        ...base.characteristics,
        constitution: 40,
        strength: 53,
      },
    })
    render(<CharacterSheetHeader character={character} />)

    const strengthCard = screen.getByRole("button", {
      name: "Бросить характеристику Сила",
    })
    const constitutionCard = screen.getByRole("button", {
      name: "Бросить характеристику Выносливость",
    })
    await user.click(strengthCard)

    await waitFor(() =>
      expect(toastMocks.error).toHaveBeenCalledWith("Не удалось бросить d100"),
    )
    expect(strengthCard).not.toBeDisabled()
    expect(constitutionCard).not.toBeDisabled()
    expect(toastMocks).not.toHaveBeenCalled()
  })

  it("keeps only digits in characteristic editor fields", async () => {
    const user = userEvent.setup()
    setTestViewport(1280)
    render(<CharacterSheetHeader character={characterDetailFixture()} />)

    await user.click(
      screen.getByRole("button", { name: "Редактировать характеристики" }),
    )
    const strengthInput = screen.getByRole("textbox", { name: "Сила" })
    await user.clear(strengthInput)
    await user.type(strengthInput, "1a2")
    expect(strengthInput).toHaveValue("12")
    await user.clear(strengthInput)
    await user.type(strengthInput, "999")
    expect(strengthInput).toHaveValue("100")
    await user.click(screen.getByRole("button", { name: "Сохранить" }))

    await waitFor(() =>
      expect(mutations.updateCharacteristics.mutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({ strength: 100 }),
      ),
    )
  })

  it("discards editor changes after cancellation", async () => {
    const user = userEvent.setup()
    setTestViewport(1280)
    const base = characterDetailFixture()
    const character = characterDetailFixture({
      characteristics: { ...base.characteristics, strength: 50 },
    })
    render(<CharacterSheetHeader character={character} />)

    const editButton = screen.getByRole("button", {
      name: "Редактировать характеристики",
    })
    await user.click(editButton)
    const strengthInput = screen.getByRole("textbox", { name: "Сила" })
    await user.clear(strengthInput)
    await user.type(strengthInput, "60")
    await user.click(screen.getByRole("button", { name: "Отмена" }))
    await user.click(editButton)

    expect(screen.getByRole("textbox", { name: "Сила" })).toHaveValue("50")
    expect(mutations.updateCharacteristics.mutateAsync).not.toHaveBeenCalled()
  })

  it("keeps resource changes in a draft until saving both values", async () => {
    const user = userEvent.setup()
    render(<CharacterSheetHeader character={characterDetailFixture()} />)
    const healthCard = screen
      .getAllByTestId("character-resource")
      .find((resource) => resource.dataset.resource === "hp")
    expect(healthCard).toBeDefined()

    await user.click(
      screen.getByRole("button", {
        name: "Изменить ресурс Здоровье",
      }),
    )
    expect(
      screen.getByRole("dialog", { name: "Изменить ресурс: Здоровье" }),
    ).toHaveClass("fixed")
    const input = screen.getByRole("textbox", {
      name: "Текущее значение ресурса",
    })
    await user.clear(input)
    await user.type(input, "7")

    expect(mutations.resource.mutateAsync).not.toHaveBeenCalled()
    expect(healthCard).toHaveTextContent("6/20")

    await user.click(screen.getByRole("button", { name: "Сохранить" }))

    await waitFor(() =>
      expect(mutations.resource.mutateAsync).toHaveBeenCalledWith({
        resource: "hp",
        values: { current_hp: 7, max_hp: 20 },
      }),
    )
  })

  it("removes resource inline controls and discards a cancelled draft", async () => {
    const user = userEvent.setup()
    render(<CharacterSheetHeader character={characterDetailFixture()} />)

    const resourceGrid = screen.getByTestId("character-resource-grid")
    expect(resourceGrid.querySelectorAll("input")).toHaveLength(0)
    expect(
      screen.queryByRole("button", { name: "Удалить ресурс Здоровье" }),
    ).not.toBeInTheDocument()

    const health = screen.getByRole("button", {
      name: "Изменить ресурс Здоровье",
    })
    await user.click(health)
    const current = screen.getByRole("textbox", {
      name: "Текущее значение ресурса",
    })
    await user.clear(current)
    await user.type(current, "7")
    await user.click(screen.getByRole("button", { name: "Отмена" }))
    await user.click(health)

    expect(
      screen.getByRole("textbox", { name: "Текущее значение ресурса" }),
    ).toHaveValue("6")
    expect(mutations.resource.mutateAsync).not.toHaveBeenCalled()
  })

  it("closes the resource calculator from its header button", async () => {
    const user = userEvent.setup()
    render(<CharacterSheetHeader character={characterDetailFixture()} />)

    await user.click(
      screen.getByRole("button", { name: "Изменить ресурс Здоровье" }),
    )
    await user.click(
      screen.getByRole("button", { name: "Закрыть калькулятор ресурса" }),
    )

    expect(
      screen.queryByRole("dialog", { name: "Изменить ресурс: Здоровье" }),
    ).not.toBeInTheDocument()
    expect(mutations.resource.mutateAsync).not.toHaveBeenCalled()
  })

  it("blocks a resource draft when current exceeds maximum", async () => {
    const user = userEvent.setup()
    render(<CharacterSheetHeader character={characterDetailFixture()} />)

    await user.click(
      screen.getByRole("button", { name: "Изменить ресурс Здоровье" }),
    )
    const current = screen.getByRole("textbox", {
      name: "Текущее значение ресурса",
    })
    await user.clear(current)
    await user.type(current, "21")

    expect(
      screen.getByText("Текущее значение не может быть больше максимального"),
    ).toBeVisible()
    expect(screen.getByRole("button", { name: "Сохранить" })).toBeDisabled()
    expect(mutations.resource.mutateAsync).not.toHaveBeenCalled()
  })

  it("adjusts each resource draft value by one with plus and minus buttons", async () => {
    const user = userEvent.setup()
    render(<CharacterSheetHeader character={characterDetailFixture()} />)

    await user.click(
      screen.getByRole("button", { name: "Изменить ресурс Здоровье" }),
    )
    await user.click(
      screen.getByRole("button", {
        name: "Увеличить текущее значение ресурса",
      }),
    )
    await user.click(
      screen.getByRole("button", {
        name: "Уменьшить максимальное значение ресурса",
      }),
    )

    expect(
      screen.getByRole("textbox", { name: "Текущее значение ресурса" }),
    ).toHaveValue("7")
    expect(
      screen.getByRole("textbox", { name: "Максимальное значение ресурса" }),
    ).toHaveValue("19")
  })

  it("applies a health damage roll only to the draft until saving", async () => {
    const user = userEvent.setup()
    diceMutation.mutateAsync.mockResolvedValueOnce({
      expression: "1d3",
      result: 3,
    })
    render(<CharacterSheetHeader character={characterDetailFixture()} />)

    await user.click(
      screen.getByRole("button", {
        name: "Изменить ресурс Здоровье",
      }),
    )
    expect(screen.getByText("Урон")).toBeVisible()
    expect(screen.queryByText("Правила CoC 7e")).not.toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Формула броска" })).toHaveValue(
      "1d3",
    )

    await user.click(screen.getByRole("button", { name: "Бросить" }))

    await waitFor(() =>
      expect(diceMutation.mutateAsync).toHaveBeenCalledWith("1d3"),
    )
    expect(
      screen.getByRole("textbox", { name: "Текущее значение ресурса" }),
    ).toHaveValue("3")
    expect(mutations.resource.mutateAsync).not.toHaveBeenCalled()

    await user.click(screen.getByRole("button", { name: "Сохранить" }))

    await waitFor(() =>
      expect(mutations.resource.mutateAsync).toHaveBeenCalledWith({
        resource: "hp",
        values: { current_hp: 3, max_hp: 20 },
      }),
    )
  })

  it("adds a SAN insanity reminder after a loss of five or more", async () => {
    const user = userEvent.setup()
    diceMutation.mutateAsync.mockResolvedValueOnce({
      expression: "1d6",
      result: 5,
    })
    render(<CharacterSheetHeader character={characterDetailFixture()} />)

    await user.click(
      screen.getByRole("button", {
        name: "Изменить ресурс Рассудок",
      }),
    )
    const formula = screen.getByRole("textbox", {
      name: "Формула броска",
    })
    await user.clear(formula)
    await user.type(formula, "1d6")
    await user.click(screen.getByRole("button", { name: "Бросить" }))

    expect(
      await screen.findByText(
        "Потеря 5+ пунктов рассудка от одного источника: проведите проверку ИНТ.",
      ),
    ).toBeVisible()
    expect(mutations.resource.mutateAsync).not.toHaveBeenCalled()
  })

  it("validates and uploads a new portrait", async () => {
    const user = userEvent.setup()
    const { container } = render(
      <CharacterSheetHeader character={characterDetailFixture()} />,
    )
    const input =
      container.querySelector<HTMLInputElement>('input[type="file"]')
    expect(input).not.toBeNull()
    const portrait = new File(["portrait"], "portrait.png", {
      type: "image/png",
    })

    await user.upload(input as HTMLInputElement, portrait)

    await waitFor(() =>
      expect(mutations.portrait.mutateAsync).toHaveBeenCalledWith(portrait),
    )
  })
})
