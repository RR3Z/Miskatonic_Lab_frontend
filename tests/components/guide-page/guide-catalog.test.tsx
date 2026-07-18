import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { GuideCatalog } from "@/components/guide/catalog/guide-catalog"
import { SidebarProvider } from "@/components/ui/sidebar"
import { guideContent } from "@/data/guide/guide-content.data"

function renderCatalog(onNavigate = vi.fn()) {
  return {
    onNavigate,
    ...render(
      <SidebarProvider>
        <GuideCatalog onNavigate={onNavigate} />
      </SidebarProvider>,
    ),
  }
}

describe("GuideCatalog", () => {
  it("renders every section and block as a stable guide link", () => {
    renderCatalog()

    for (const section of guideContent.sections) {
      expect(screen.getByRole("link", { name: section.title })).toHaveAttribute(
        "href",
        `/guide/${section.slug}`,
      )

      for (const block of section.blocks) {
        const link = screen.getByRole("link", { name: block.title })

        expect(link).toHaveAttribute(
          "href",
          `/guide/${section.slug}#${block.id}`,
        )
        expect(link).toHaveClass("block", "w-full", "hover:bg-sidebar-accent")
      }
    }
  })

  it("calls navigation cleanup when a nested block is chosen", async () => {
    const user = userEvent.setup()
    const { onNavigate } = renderCatalog()
    const section = guideContent.sections[0]
    const block = section?.blocks[0]

    if (!section || !block) {
      throw new Error("Guide content fixture is required")
    }

    await user.click(screen.getByRole("link", { name: block.title }))

    expect(onNavigate).toHaveBeenCalledOnce()
  })
})
