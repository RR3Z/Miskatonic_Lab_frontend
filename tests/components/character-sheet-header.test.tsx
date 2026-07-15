import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { CharacterSheetHeader } from "@/components/character/detail/header/character-sheet-header"
import { characterDetailFixture } from "../fixtures/character-detail"

const mutations = vi.hoisted(() => ({
  deleteCharacteristics: { mutateAsync: vi.fn() },
  deleteDerivedStats: { mutateAsync: vi.fn() },
  deleteResource: { mutateAsync: vi.fn() },
  portrait: { isPending: false, mutateAsync: vi.fn() },
  profile: { mutateAsync: vi.fn() },
  resource: { mutateAsync: vi.fn() },
  updateCharacteristics: { mutateAsync: vi.fn() },
  updateDerivedStats: { mutateAsync: vi.fn() },
}))
const toastMocks = vi.hoisted(() => ({ error: vi.fn() }))

vi.mock("sonner", () => ({ toast: toastMocks }))

vi.mock("@/lib/api/use-character-profile", () => ({
  useUpdateCharacterPortrait: () => mutations.portrait,
  useUpdateCharacterProfile: () => mutations.profile,
}))

vi.mock("@/lib/api/use-character-statistics", () => ({
  useDeleteCharacterCharacteristics: () => mutations.deleteCharacteristics,
  useDeleteCharacterDerivedStats: () => mutations.deleteDerivedStats,
  useUpdateCharacterCharacteristics: () => mutations.updateCharacteristics,
  useUpdateCharacterDerivedStats: () => mutations.updateDerivedStats,
}))

vi.mock("@/lib/api/use-character-resources", () => ({
  useDeleteCharacterResource: () => mutations.deleteResource,
  useUpdateCharacterResource: () => mutations.resource,
}))

describe("CharacterSheetHeader", () => {
  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 1024,
      writable: true,
    })
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
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 1280,
      writable: true,
    })
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

    expect(screen.getByTestId("characteristic-card-СИЛ")).toHaveTextContent(
      "53",
    )
    expect(screen.getByTestId("characteristic-card-СИЛ")).toHaveTextContent(
      "26",
    )
    expect(screen.getByTestId("characteristic-card-СИЛ")).toHaveTextContent(
      "10",
    )

    const editButton = screen.getByRole("button", {
      name: "Редактировать характеристики",
    })
    expect(editButton).toHaveAttribute("title", "Изменить")
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

  it("keeps only digits in characteristic editor fields", async () => {
    const user = userEvent.setup()
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 1280,
      writable: true,
    })
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
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 1280,
      writable: true,
    })
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

  it("updates a resource value through its backend subresource", async () => {
    const user = userEvent.setup()
    render(<CharacterSheetHeader character={characterDetailFixture()} />)

    await user.click(
      screen.getByRole("button", {
        name: "Редактировать текущее значение Здоровье",
      }),
    )
    const input = screen.getByRole("textbox", {
      name: "Редактировать текущее значение Здоровье",
    })
    await user.clear(input)
    await user.type(input, "7{Enter}")

    await waitFor(() =>
      expect(mutations.resource.mutateAsync).toHaveBeenCalledWith({
        resource: "hp",
        values: { current_hp: 7 },
      }),
    )
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
