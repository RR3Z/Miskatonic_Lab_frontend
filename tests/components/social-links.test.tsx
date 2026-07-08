import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { SocialLinks } from "@/components/social/social-links"

const testLinks = [
  { href: "https://t.me/test", icon: { src: "/telegram.svg", height: 36, width: 36 } as never, label: "Telegram @test" },
  { href: "https://github.com/test", icon: { src: "/github.svg", height: 36, width: 36 } as never, label: "GitHub test" },
]

describe("SocialLinks", () => {
  it("renders all links with correct href and aria-label", () => {
    render(<SocialLinks links={testLinks} />)

    const telegram = screen.getByRole("link", { name: /telegram @test/i })
    expect(telegram).toHaveAttribute("href", "https://t.me/test")
    expect(telegram).toHaveAttribute("target", "_blank")
    expect(telegram).toHaveAttribute("rel", "noopener noreferrer")

    const github = screen.getByRole("link", { name: /github test/i })
    expect(github).toHaveAttribute("href", "https://github.com/test")
    expect(github).toHaveAttribute("target", "_blank")
    expect(github).toHaveAttribute("rel", "noopener noreferrer")
  })

  it("applies iconClassName to images", () => {
    const { container } = render(
      <SocialLinks iconClassName="custom-icon" links={testLinks} />,
    )

    const images = container.querySelectorAll("img")
    expect(images.length).toBe(2)
    images.forEach((img) => {
      expect(img.getAttribute("class")).toContain("custom-icon")
    })
  })
})
