import { act, render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { toast } from "sonner"
import { afterEach, describe, expect, it } from "vitest"

import {
  DICE_RESULT_TOASTER_ID,
  TOAST_DURATION_MS,
  Toaster,
} from "@/components/ui/sonner"

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

  it("uses a uniform one-pixel border", async () => {
    render(<Toaster />)
    act(() => {
      toast.success("Проверка рамки")
    })

    const title = await screen.findByText("Проверка рамки")
    const notification = title.closest("[data-sonner-toast]")
    expect(notification?.className).toContain("border!")
    expect(notification?.className).not.toContain("border-l-4!")
  })

  it("renders dice results at the bottom right with a close button", async () => {
    const user = userEvent.setup()
    render(
      <Toaster
        containerAriaLabel="Результаты бросков"
        duration={TOAST_DURATION_MS}
        id={DICE_RESULT_TOASTER_ID}
        position="bottom-right"
      />,
    )
    act(() => {
      toast("Сила 53 · d100: 42 · обычный успех · 53 / 26 / 10", {
        toasterId: DICE_RESULT_TOASTER_ID,
      })
    })

    const title = await screen.findByText(
      "Сила 53 · d100: 42 · обычный успех · 53 / 26 / 10",
    )
    const notification = title.closest("[data-sonner-toast]")
    const toaster = document.querySelector(
      '[data-sonner-toaster][data-x-position="right"][data-y-position="bottom"]',
    )
    expect(toaster).toBeInTheDocument()
    expect(notification?.className).toContain(
      "w-[min(21rem,calc(100vw-2rem))]!",
    )
    expect(notification?.className).not.toContain(
      "w-[min(26rem,calc(100vw-2rem))]!",
    )

    await user.click(
      within(notification as HTMLElement).getByRole("button", {
        name: "Закрыть уведомление",
      }),
    )
    await waitFor(() => expect(title).not.toBeInTheDocument())
  })

  it("keeps dice results separate from ordinary notifications", async () => {
    render(
      <>
        <Toaster />
        <Toaster
          containerAriaLabel="Результаты бросков"
          id={DICE_RESULT_TOASTER_ID}
          position="bottom-right"
        />
      </>,
    )
    act(() => {
      toast("Обычное сообщение")
      toast("Результат d100", { toasterId: DICE_RESULT_TOASTER_ID })
    })

    const standardToast = (
      await screen.findByText("Обычное сообщение")
    ).closest("[data-sonner-toaster]")
    const diceToast = (await screen.findByText("Результат d100")).closest(
      "[data-sonner-toaster]",
    )

    expect(standardToast).toHaveAttribute("data-x-position", "center")
    expect(standardToast).toHaveAttribute("data-y-position", "top")
    expect(diceToast).toHaveAttribute("data-x-position", "right")
    expect(diceToast).toHaveAttribute("data-y-position", "bottom")
  })

  it("keeps standard notifications for at least 30 seconds", () => {
    expect(TOAST_DURATION_MS).toBe(30_000)
  })

  it.each([
    [
      "success",
      () => toast.success("Персонаж создан"),
      "Персонаж создан",
      "success",
    ],
    [
      "error",
      () => toast.error("Не удалось создать"),
      "Не удалось создать",
      "error",
    ],
    [
      "warning",
      () => toast.warning("Портрет не загружен"),
      "Портрет не загружен",
      "warning",
    ],
  ])(
    "applies project colors to %s notifications",
    async (_, show, message, type) => {
      render(<Toaster />)

      act(() => {
        show()
      })

      const title = await screen.findByText(message)
      const notification = title.closest("[data-sonner-toast]")
      expect(notification?.className).toContain(`--ml-toast-${type}-bg`)
      expect(notification?.className).toContain(`--ml-toast-${type}-border`)
      expect(notification?.className).toContain(`--ml-toast-${type}-accent`)
      expect(notification?.className).toContain("--ml-ink-primary")
    },
  )
})
