import { act, render, screen } from "@testing-library/react"
import { toast } from "sonner"
import { afterEach, describe, expect, it } from "vitest"

import { Toaster } from "@/components/ui/sonner"

describe("Toaster", () => {
  afterEach(() => {
    toast.dismiss()
  })

  it("renders notifications at the top center", async () => {
    render(<Toaster />)
    act(() => {
      toast("Проверка позиции")
    })

    await screen.findByText("Проверка позиции")
    expect(screen.getByLabelText("Уведомления alt+T")).toBeInTheDocument()
    const toaster = document.querySelector("[data-sonner-toaster]")
    expect(toaster).toHaveAttribute("data-x-position", "center")
    expect(toaster).toHaveAttribute("data-y-position", "top")
  })

  it.each([
    [
      "success",
      () => toast.success("Персонаж создан"),
      "Персонаж создан",
      "success-bg",
    ],
    [
      "error",
      () => toast.error("Не удалось создать"),
      "Не удалось создать",
      "error-bg",
    ],
    [
      "warning",
      () => toast.warning("Портрет не загружен"),
      "Портрет не загружен",
      "warning-bg",
    ],
  ])(
    "applies project colors to %s notifications",
    async (_, show, message, token) => {
      render(<Toaster />)

      act(() => {
        show()
      })

      const title = await screen.findByText(message)
      const notification = title.closest("[data-sonner-toast]")
      expect(notification?.className).toContain(`--ml-toast-${token}`)
    },
  )
})
