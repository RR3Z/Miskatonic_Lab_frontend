import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { DeleteConfirmationDialog } from "@/components/character/detail/editors/delete-confirmation-dialog"

const toastError = vi.hoisted(() => vi.fn())

vi.mock("sonner", () => ({
  toast: { error: toastError },
}))

describe("DeleteConfirmationDialog", () => {
  it("locks controls while pending and closes after success", async () => {
    const user = userEvent.setup()
    let resolveDelete: (value?: unknown) => void = () => undefined
    const onConfirm = vi.fn(
      () =>
        new Promise<unknown>((resolve) => {
          resolveDelete = resolve
        }),
    )
    const onOpenChange = vi.fn()
    render(
      <DeleteConfirmationDialog
        description="Ресурс будет удалён."
        errorMessage="Не удалось удалить ресурс"
        onConfirm={onConfirm}
        onOpenChange={onOpenChange}
        open
        title="Удалить ресурс?"
      />,
    )

    await user.click(screen.getByRole("button", { name: "Удалить" }))

    expect(screen.getByRole("button", { name: "Отмена" })).toBeDisabled()
    expect(screen.getByRole("status", { name: "Удаление" })).toBeVisible()
    resolveDelete()

    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it("keeps the dialog open and reports a failure", async () => {
    const user = userEvent.setup()
    toastError.mockReset()
    const onOpenChange = vi.fn()
    render(
      <DeleteConfirmationDialog
        description="Ресурс будет удалён."
        errorMessage="Не удалось удалить ресурс"
        onConfirm={vi.fn(async () => {
          throw new Error("network failed")
        })}
        onOpenChange={onOpenChange}
        open
        title="Удалить ресурс?"
      />,
    )

    await user.click(screen.getByRole("button", { name: "Удалить" }))

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith("Не удалось удалить ресурс"),
    )
    expect(onOpenChange).not.toHaveBeenCalledWith(false)
    expect(screen.getByRole("alertdialog")).toBeVisible()
    expect(screen.getByRole("button", { name: "Удалить" })).toBeEnabled()
  })
})
