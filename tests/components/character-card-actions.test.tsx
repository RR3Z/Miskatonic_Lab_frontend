import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { CharacterCardActions } from "@/components/character/character-card-actions"

const mocks = vi.hoisted(() => ({
  toastError: vi.fn(),
}))

vi.mock("sonner", () => ({
  toast: {
    error: mocks.toastError,
  },
}))

const character = { id: "character-1", name: "Сыщик" }

async function openDeleteDialog() {
  const user = userEvent.setup()
  await user.click(
    screen.getByRole("button", {
      name: `Действия персонажа ${character.name}`,
    }),
  )
  await user.click(screen.getByRole("menuitem", { name: "Удалить" }))
  return user
}

describe("CharacterCardActions", () => {
  beforeEach(() => {
    mocks.toastError.mockClear()
  })

  it("deletes the selected character after confirmation", async () => {
    const onDelete = vi.fn().mockResolvedValue(undefined)
    render(<CharacterCardActions character={character} onDelete={onDelete} />)
    const user = await openDeleteDialog()

    await user.click(screen.getByRole("button", { name: "Удалить" }))

    await waitFor(() =>
      expect(onDelete).toHaveBeenCalledExactlyOnceWith(character.id),
    )
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument()
  })

  it("keeps the dialog open and reports a delete failure", async () => {
    const onDelete = vi.fn().mockRejectedValue(new Error("failed"))
    render(<CharacterCardActions character={character} onDelete={onDelete} />)
    const user = await openDeleteDialog()

    await user.click(screen.getByRole("button", { name: "Удалить" }))

    await waitFor(() =>
      expect(mocks.toastError).toHaveBeenCalledWith(
        "Не удалось удалить персонажа. Попробуйте ещё раз.",
        { id: "character-delete-error-character-1" },
      ),
    )
    expect(screen.getByRole("alertdialog")).toBeVisible()
  })
})
