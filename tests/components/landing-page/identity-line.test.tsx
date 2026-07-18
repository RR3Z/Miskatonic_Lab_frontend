import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { z } from "zod"

import { IdentityLine } from "@/components/character/detail/header/identity-line"

vi.mock("sonner", () => ({ toast: { error: vi.fn() } }))

describe("IdentityLine", () => {
  it("keeps General Info editing compact", async () => {
    const user = userEvent.setup()

    render(
      <IdentityLine
        ariaLabel="Редактировать место жительства"
        label="Место жительства"
        onSave={vi.fn(async () => undefined)}
        schema={z.string()}
        value="Аркхэм"
      />,
    )

    const editor = screen.getByRole("button", {
      name: "Редактировать место жительства",
    })
    expect(editor).toHaveClass("h-6", "px-1.5", "py-0")

    await user.click(editor)

    expect(
      screen.getByRole("textbox", {
        name: "Редактировать место жительства",
      }),
    ).toHaveClass("h-6", "min-h-6", "px-1.5", "py-0")
    expect(
      screen.getByRole("textbox", {
        name: "Редактировать место жительства",
      }),
    ).toHaveAttribute("data-variant", "default")
  })
})
