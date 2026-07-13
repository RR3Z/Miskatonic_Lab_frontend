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
    const cardShell = card.closest('[data-slot="card"]')
    expect(cardShell).toHaveClass("h-[120px]")
    expect(cardShell).toHaveAttribute("data-size", "sm")
    const tentacle = screen.getByTestId("character-card-tentacle")
    expect(tentacle).toHaveClass(
      "pointer-events-none",
      "absolute",
      "inset-0",
      "bg-cover",
      "opacity-[0.11]",
    )
    expect(tentacle.style.backgroundImage).toContain("character-card-tentacle")

    await user.click(card)
    expect(onCreate).toHaveBeenCalledOnce()
  })
})
