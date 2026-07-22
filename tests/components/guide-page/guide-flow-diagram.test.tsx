import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { GuideFlowDiagram } from "@/components/guide/flow-diagram/guide-flow-diagram"
import { guideContent } from "@/lib/guide/guide-content"

const diagram = guideContent.sections[0]?.blocks[0]?.diagram

if (!diagram) {
  throw new Error("Guide flow diagram fixture is required")
}

describe("GuideFlowDiagram", () => {
  it("renders accessible desktop and mobile representations of every step", () => {
    const { container } = render(<GuideFlowDiagram diagram={diagram} />)

    expect(
      screen.getByRole("figure", { name: diagram.ariaLabel }),
    ).toBeVisible()
    expect(screen.getByText(diagram.title)).toBeVisible()

    for (const step of diagram.steps) {
      expect(screen.getAllByText(step.label)).toHaveLength(2)
      if (step.detail) {
        expect(screen.getAllByText(step.detail)).toHaveLength(2)
      }
    }

    expect(container.querySelector("ol.lg\\:hidden")).toBeInTheDocument()
    expect(container.querySelector("ol.lg\\:grid")).toBeInTheDocument()
  })
})
