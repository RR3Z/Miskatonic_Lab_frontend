import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { CharacterCardActions } from "@/components/character/character-card-actions"

const mocks = vi.hoisted(() => ({
  toastError: vi.fn(),
  toastSuccess: vi.fn(),
}))

vi.mock("sonner", () => ({
  toast: {
    error: mocks.toastError,
    success: mocks.toastSuccess,
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
    mocks.toastSuccess.mockClear()
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
    expect(mocks.toastSuccess).not.toHaveBeenCalled()
  })

  it("shows only an accessible spinner while deletion is pending", async () => {
    let resolveDelete: (() => void) | undefined
    const onDelete = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveDelete = resolve
        }),
    )
    render(<CharacterCardActions character={character} onDelete={onDelete} />)
    const user = await openDeleteDialog()

    await user.click(screen.getByRole("button", { name: "Удалить" }))

    expect(
      screen.getByRole("status", { name: "Удаление персонажа" }),
    ).toBeVisible()
    expect(screen.queryByText("Удаление…")).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Отмена" })).toBeDisabled()

    resolveDelete?.()
    await waitFor(() =>
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument(),
    )
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
    expect(mocks.toastSuccess).not.toHaveBeenCalled()
  })
})
