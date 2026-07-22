import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { SidebarSiteFooter } from "@/components/layout/site-footer"
import { landingContent } from "@/data/locales/utils/landing-content.util"

describe("SidebarSiteFooter", () => {
  it("keeps legal and social content inside the sidebar", () => {
    const { container } = render(<SidebarSiteFooter />)

    expect(container.querySelector("footer")).toHaveClass(
      "group-data-[collapsible=icon]:hidden",
    )
    expect(screen.getByText(landingContent.footer.notice)).toBeVisible()
    expect(screen.getByText(landingContent.footer.copyright)).toBeVisible()
    expect(
      screen.getByRole("link", { name: /telegram @roger3z/i }),
    ).toHaveAttribute("href", "https://t.me/RogeR3Z")
    expect(screen.getByRole("link", { name: /github rr3z/i })).toHaveAttribute(
      "href",
      "https://github.com/RR3Z",
    )
  })
})
