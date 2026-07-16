import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { CharacterNameEditor } from "@/components/character/detail/header/character-name-editor"

vi.mock("sonner", () => ({ toast: { error: vi.fn() } }))

describe("CharacterNameEditor", () => {
  it("keeps matching padding in display and edit states", async () => {
    const user = userEvent.setup()

    render(
      <CharacterNameEditor name="Тест" onSave={vi.fn(async () => undefined)} />,
    )

    const button = screen.getByRole("button", {
      name: "Редактировать имя персонажа",
    })
    expect(button).toHaveClass("px-2")

    await user.click(button)

    const input = screen.getByRole("textbox", {
      name: "Редактировать имя персонажа",
    })
    expect(input).toHaveClass("px-2", "text-3xl", "md:text-3xl")
  })
})
