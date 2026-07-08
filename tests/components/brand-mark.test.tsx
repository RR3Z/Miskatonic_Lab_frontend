import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { BrandMark } from "@/components/brand/brand-mark"

describe("BrandMark", () => {
  it("renders logo with alt text", () => {
    render(<BrandMark />)

    expect(screen.getByAltText("Miskatonic Lab")).toBeInTheDocument()
  })

  it("accepts priority prop", () => {
    render(<BrandMark priority />)

    expect(screen.getByAltText("Miskatonic Lab")).toBeInTheDocument()
  })

  it("renders without priority by default", () => {
    render(<BrandMark />)

    expect(screen.getByAltText("Miskatonic Lab")).toBeInTheDocument()
  })
})
