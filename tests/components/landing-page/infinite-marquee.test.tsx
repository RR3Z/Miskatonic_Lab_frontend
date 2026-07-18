import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { InfiniteMarquee } from "@/components/marquee/infinite-marquee"

describe("InfiniteMarquee", () => {
  it("renders duplicated content for seamless looping", () => {
    render(
      <InfiniteMarquee aria-label="Features" items={["Archive", "Rooms"]} />,
    )

    expect(screen.getByLabelText("Features")).toBeVisible()
    expect(screen.getByTestId("infinite-marquee-track")).toBeVisible()
    expect(screen.getAllByText("Archive")).toHaveLength(3)
    expect(screen.getAllByText("Rooms")).toHaveLength(3)
  })
})
