import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { CreateCharacterCard } from "@/components/character/create-character-card"

describe("CreateCharacterCard", () => {
  it("opens the creation flow", async () => {
    const user = userEvent.setup()
    const onCreate = vi.fn()
    render(<CreateCharacterCard onCreate={onCreate} />)

    const card = screen.getByRole("button", { name: /создать нового сыщика/i })
    expect(card).toBeEnabled()
    expect(card).toHaveClass("h-[104px]")

    await user.click(card)
    expect(onCreate).toHaveBeenCalledOnce()
  })
})
