import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { CreateCharacterCard } from "@/components/character/create-character-card"

describe("CreateCharacterCard", () => {
  it("stays disabled before creation flow exists", () => {
    render(<CreateCharacterCard />)

    const card = screen.getByRole("button", { name: /создать нового сыщика/i })
    expect(card).toBeDisabled()
    expect(card).toHaveClass("h-[104px]")
  })

  it("shows the limit label at 30 characters", () => {
    render(<CreateCharacterCard atLimit />)

    expect(
      screen.getByRole("button", { name: /достигнут лимит персонажей/i }),
    ).toBeDisabled()
  })
})
