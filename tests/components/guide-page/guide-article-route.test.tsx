import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const routeState = vi.hoisted(() => ({
  notFound: vi.fn(),
}))

vi.mock("next/navigation", () => ({
  notFound: routeState.notFound,
}))

vi.mock("@/components/guide/article/guide-article-page", () => ({
  GuideArticlePage: ({
    matchedBlockId,
    section,
  }: {
    matchedBlockId?: string
    section: { title: string }
  }) => (
    <div data-testid="guide-article-page">
      {section.title}:{matchedBlockId ?? "no-match"}
    </div>
  ),
}))

import GuideArticleRoute from "@/app/guide/[slug]/page"

describe("GuideArticleRoute", () => {
  beforeEach(() => {
    routeState.notFound.mockReset()
    routeState.notFound.mockImplementation(() => {
      throw new Error("not found")
    })
  })

  it("passes the resolved section and match query to the article owner", async () => {
    const page = await GuideArticleRoute({
      params: Promise.resolve({ slug: "creation" }),
      searchParams: Promise.resolve({ match: "creation-order" }),
    })

    render(page)

    expect(screen.getByTestId("guide-article-page")).toHaveTextContent(
      "Создание сыщика:creation-order",
    )
  })

  it("uses Next notFound for an unknown section", async () => {
    await expect(
      GuideArticleRoute({
        params: Promise.resolve({ slug: "unknown" }),
        searchParams: Promise.resolve({}),
      }),
    ).rejects.toThrow("not found")

    expect(routeState.notFound).toHaveBeenCalledOnce()
  })
})
