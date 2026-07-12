import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { MobileSiteFooter, SiteFooter } from "@/components/layout/site-footer"
import { landingContent } from "@/lib/content/landing.content"

describe("SiteFooter", () => {
  it("keeps the full legal footer on desktop only", () => {
    const { container } = render(<SiteFooter />)

    expect(container.querySelector("footer")).toHaveClass("hidden", "sm:flex")
    expect(
      screen.getByRole("link", { name: /telegram @roger3z/i }).parentElement,
    ).toHaveClass(
      "min-[968px]:absolute",
      "min-[968px]:right-8",
      "min-[968px]:bottom-4",
    )
    expect(screen.getByText(landingContent.footer.notice)).toBeVisible()
    expect(screen.getByText(landingContent.footer.copyright)).toBeVisible()
  })

  it("renders only copyright and social links in the mobile variant", () => {
    const { container } = render(<MobileSiteFooter />)

    expect(container.querySelector("footer")).toHaveClass("sm:hidden")
    expect(screen.getByText(landingContent.footer.copyright)).toBeVisible()
    expect(
      screen.queryByText(landingContent.footer.notice),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: /telegram @roger3z/i }),
    ).toHaveAttribute("href", "https://t.me/RogeR3Z")
    expect(screen.getByRole("link", { name: /github rr3z/i })).toHaveAttribute(
      "href",
      "https://github.com/RR3Z",
    )
  })
})
