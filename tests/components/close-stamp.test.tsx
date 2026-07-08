import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { CloseStamp } from "@/components/landing/close-stamp"

describe("CloseStamp", () => {
  it("renders SVG with title", () => {
    render(<CloseStamp />)

    expect(screen.getByTitle("Закрыто")).toBeInTheDocument()
  })

  it("accepts className prop", () => {
    const { container } = render(<CloseStamp className="w-25 rotate-3" />)

    expect(container.querySelector("svg")).toHaveAttribute("class")
  })

  it("renders with expected viewBox", () => {
    const { container } = render(<CloseStamp />)

    expect(container.querySelector("svg")).toHaveAttribute(
      "viewBox",
      "0 0 137 39",
    )
  })
})
