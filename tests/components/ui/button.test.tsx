import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Button } from "@/components/ui/button"

describe("Button", () => {
  it("renders children and handles clicks", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<Button onClick={onClick}>Roll dice</Button>)

    await user.click(screen.getByRole("button", { name: "Roll dice" }))

    expect(onClick).toHaveBeenCalledOnce()
  })

  it("renders with default variant", () => {
    const { container } = render(<Button>Default</Button>)

    const button = container.querySelector('[data-slot="button"]')
    expect(button).toHaveAttribute("data-variant", "default")
    expect(button).toHaveAttribute("data-size", "default")
  })

  it("applies variant and size attributes", () => {
    const { container } = render(
      <Button variant="outline" size="sm">
        Styled
      </Button>,
    )

    const button = container.querySelector('[data-slot="button"]')
    expect(button).toHaveAttribute("data-variant", "outline")
    expect(button).toHaveAttribute("data-size", "sm")
  })

  it("supports semantic success actions", () => {
    render(<Button variant="success">Accept</Button>)

    expect(screen.getByRole("button", { name: "Accept" })).toHaveAttribute(
      "data-variant",
      "success",
    )
  })

  it("renders as child element with asChild prop", () => {
    render(
      <Button asChild>
        <a href="/test">Link button</a>
      </Button>,
    )

    expect(screen.getByRole("link", { name: /link button/i })).toBeVisible()
  })
})
