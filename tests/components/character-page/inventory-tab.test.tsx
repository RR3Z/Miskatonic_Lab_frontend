import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { InventoryTab } from "@/components/character/detail/tabs/inventory-tab"
import type { CharacterInventoryItem } from "@/types/character"

const mutations = vi.hoisted(() => ({
  create: { isPending: false, mutateAsync: vi.fn() },
  delete: { mutateAsync: vi.fn() },
  update: { isPending: false, mutateAsync: vi.fn() },
}))

vi.mock("@/lib/api/use-character-inventory", () => ({
  useCreateCharacterInventoryItem: () => mutations.create,
  useDeleteCharacterInventoryItem: () => mutations.delete,
  useUpdateCharacterInventoryItem: () => mutations.update,
}))

vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }))

const flashlight: CharacterInventoryItem = {
  category: "Снаряжение",
  character_id: "character-1",
  created_at: "2026-07-18T00:00:00Z",
  description: "Надёжно светит в темноте.",
  id: "item-1",
  name: "Карманный фонарь",
  quantity: 2,
  updated_at: "2026-07-18T00:00:00Z",
}

describe("InventoryTab", () => {
  it("creates a personal inventory item and offers existing categories", async () => {
    const user = userEvent.setup()
    mutations.create.mutateAsync.mockReset()
    mutations.create.mutateAsync.mockResolvedValue(flashlight)

    render(<InventoryTab characterId="character-1" inventory={[flashlight]} />)

    expect(screen.getByText("Карманный фонарь")).toBeVisible()
    expect(screen.getByText("×2")).toBeVisible()
    await user.click(screen.getByRole("button", { name: "Добавить предмет" }))

    expect(screen.getByRole("dialog", { name: "Новый предмет" })).toBeVisible()
    expect(screen.getByLabelText("Категория")).toHaveAttribute("list")
    expect(document.querySelector("datalist option")).toHaveAttribute(
      "value",
      "Снаряжение",
    )
    await user.type(screen.getByLabelText("Название"), "  Карта города  ")
    await user.type(screen.getByLabelText("Количество"), " 3 ")
    await user.type(screen.getByLabelText("Категория"), "  Документы  ")
    await user.type(screen.getByLabelText("Описание"), "  Отмечены туннели.  ")
    await user.click(screen.getByRole("button", { name: "Добавить" }))

    await waitFor(() =>
      expect(mutations.create.mutateAsync).toHaveBeenCalledWith({
        category: "Документы",
        description: "Отмечены туннели.",
        name: "Карта города",
        quantity: 3,
      }),
    )
  })

  it("edits and deletes an item", async () => {
    const user = userEvent.setup()
    mutations.update.mutateAsync.mockReset()
    mutations.delete.mutateAsync.mockReset()
    mutations.update.mutateAsync.mockResolvedValue(flashlight)
    mutations.delete.mutateAsync.mockResolvedValue(undefined)

    render(<InventoryTab characterId="character-1" inventory={[flashlight]} />)

    await user.click(
      screen.getByRole("button", {
        name: "Редактировать предмет Карманный фонарь",
      }),
    )
    const dialog = screen.getByRole("dialog", { name: "Редактировать предмет" })
    const name = within(dialog).getByLabelText("Название")
    await user.clear(name)
    await user.type(name, "Лампа")
    await user.click(within(dialog).getByRole("button", { name: "Сохранить" }))

    await waitFor(() =>
      expect(mutations.update.mutateAsync).toHaveBeenCalledWith({
        category: "Снаряжение",
        description: "Надёжно светит в темноте.",
        name: "Лампа",
        quantity: 2,
      }),
    )

    await user.click(
      screen.getByRole("button", { name: "Удалить предмет Карманный фонарь" }),
    )
    const confirmation = screen.getByRole("alertdialog", {
      name: "Удалить предмет?",
    })
    await user.click(
      within(confirmation).getByRole("button", { name: "Удалить" }),
    )

    await waitFor(() =>
      expect(mutations.delete.mutateAsync).toHaveBeenCalledOnce(),
    )
  })
})
