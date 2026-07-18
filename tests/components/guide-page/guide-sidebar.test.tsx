import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { setTestViewport } from "@tests/utils/viewport.util"
import { describe, expect, it } from "vitest"

import { GuideSidebar } from "@/components/guide/catalog/guide-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

function renderGuideSidebar() {
  return render(
    <TooltipProvider>
      <SidebarProvider defaultOpen>
        <SidebarTrigger aria-label="Открыть каталог" />
        <GuideSidebar />
      </SidebarProvider>
    </TooltipProvider>,
  )
}

describe("GuideSidebar", () => {
  it("renders the catalogue and full-width footer separator", () => {
    const { container } = renderGuideSidebar()

    expect(screen.getByText("Каталог")).toBeVisible()
    expect(
      screen.getByRole("link", { name: "Miskatonic Lab home" }),
    ).toHaveAttribute("href", "/")
    expect(container.querySelector("footer")).toHaveClass("-mx-2")
  })

  it("opens as a mobile sheet and closes after catalogue navigation", async () => {
    setTestViewport(390)

    const user = userEvent.setup()
    renderGuideSidebar()

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Открыть каталог" }),
      ).toBeVisible(),
    )
    await user.click(screen.getByRole("button", { name: "Открыть каталог" }))

    expect(screen.getByRole("dialog")).toBeVisible()
    await user.click(screen.getByRole("link", { name: "Порядок создания" }))

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    )
  })
})
