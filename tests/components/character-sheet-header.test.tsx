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
    for (const mutation of Object.values(mutations)) {
      mutation.mutateAsync.mockReset()
      mutation.mutateAsync.mockResolvedValue(undefined)
    }
  })

  it("updates the name with the complete profile payload", async () => {
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
        age: 48,
        birthplace: "Бостон",
        name: "Генри Армитедж",
        occupation: "Антиквар",
        player_name: "Игрок",
        residence: "Нью-Йорк",
        sex: "male",
      }),
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

  it("rejects an invalid numeric characteristic without a request", async () => {
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
    expect(input).toHaveAttribute("aria-invalid", "true")
    expect(
      screen.getByText("Введите целое неотрицательное число"),
    ).toBeVisible()
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
