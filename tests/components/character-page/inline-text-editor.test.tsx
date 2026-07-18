import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { z } from "zod"

import { InlineTextEditor } from "@/components/character/detail/editors/inline-text-editor"

const toastMocks = vi.hoisted(() => ({ error: vi.fn() }))

vi.mock("sonner", () => ({ toast: toastMocks }))

const schema = z.string().trim().min(1, "Добавьте значение")

function renderEditor({
  multiline = false,
  onSave = vi.fn(async () => undefined),
}: {
  multiline?: boolean
  onSave?: (value: string) => Promise<unknown>
} = {}) {
  render(
    <InlineTextEditor
      ariaLabel="Редактировать значение"
      errorMessage="Не удалось сохранить значение"
      multiline={multiline}
      onSave={onSave}
      placeholder="Пусто"
      schema={schema}
      value="Исходное значение"
    />,
  )

  return { onSave }
}

describe("InlineTextEditor", () => {
  beforeEach(() => {
    toastMocks.error.mockReset()
  })

  it("opens on click, saves a trimmed single-line value with Enter", async () => {
    const user = userEvent.setup()
    const { onSave } = renderEditor()

    await user.click(
      screen.getByRole("button", { name: "Редактировать значение" }),
    )
    const input = screen.getByRole("textbox", {
      name: "Редактировать значение",
    })
    await user.clear(input)
    await user.type(input, "  Новое значение  {Enter}")

    await waitFor(() => expect(onSave).toHaveBeenCalledWith("Новое значение"))
  })

  it("cancels the draft with Escape without saving", async () => {
    const user = userEvent.setup()
    const { onSave } = renderEditor()

    await user.click(
      screen.getByRole("button", { name: "Редактировать значение" }),
    )
    const input = screen.getByRole("textbox", {
      name: "Редактировать значение",
    })
    await user.clear(input)
    await user.type(input, "Черновик{Escape}")

    expect(onSave).not.toHaveBeenCalled()
    expect(
      screen.getByRole("button", { name: "Редактировать значение" }),
    ).toHaveTextContent("Исходное значение")
  })

  it("keeps invalid input open and shows its validation error through Sonner", async () => {
    const user = userEvent.setup()
    const { onSave } = renderEditor()

    await user.click(
      screen.getByRole("button", { name: "Редактировать значение" }),
    )
    const input = screen.getByRole("textbox", {
      name: "Редактировать значение",
    })
    await user.clear(input)
    await user.keyboard("{Enter}")

    expect(onSave).not.toHaveBeenCalled()
    expect(toastMocks.error).toHaveBeenCalledWith("Добавьте значение")
    expect(screen.queryByText("Добавьте значение")).not.toBeInTheDocument()
  })

  it("locks a pending save and keeps a failed draft editable", async () => {
    const user = userEvent.setup()
    let rejectSave: (reason?: unknown) => void = () => undefined
    const onSave = vi.fn(
      () =>
        new Promise<unknown>((_, reject) => {
          rejectSave = reject
        }),
    )
    renderEditor({ multiline: true, onSave })

    await user.click(
      screen.getByRole("button", { name: "Редактировать значение" }),
    )
    const input = screen.getByRole("textbox", {
      name: "Редактировать значение",
    })
    await user.clear(input)
    await user.type(input, "Новый текст{Control>}{Enter}{/Control}")

    expect(input).toBeDisabled()
    expect(onSave).toHaveBeenCalledOnce()

    rejectSave(new Error("network failed"))

    await waitFor(() => expect(input).toBeEnabled())
    expect(input).toHaveValue("Новый текст")
    expect(toastMocks.error).toHaveBeenCalledWith(
      "Не удалось сохранить значение",
    )
    expect(
      screen.queryByText("Не удалось сохранить значение"),
    ).not.toBeInTheDocument()
  })
})
