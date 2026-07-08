import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { LandingMarquee } from "@/components/landing/landing-marquee"

describe("LandingMarquee", () => {
  it("renders with aria-label", () => {
    render(<LandingMarquee />)

    expect(screen.getByLabelText("Возможности Miskatonic Lab")).toBeVisible()
  })

  it("renders all marquee items", () => {
    render(<LandingMarquee />)

    expect(screen.getAllByText("Лист персонажа").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Онлайн комнаты").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Симулятор бросков").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Хроника событий").length).toBeGreaterThan(0)
  })
})
