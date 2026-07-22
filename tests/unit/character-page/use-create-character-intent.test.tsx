import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"

import { useCreateCharacterIntent } from "@/hooks/character/use-create-character-intent"

describe("useCreateCharacterIntent", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/characters?create=1&source=landing")
  })

  it("waits until creation is available before consuming the URL intent", () => {
    const { result, rerender } = renderHook(
      ({ canOpen }) => useCreateCharacterIntent(canOpen),
      { initialProps: { canOpen: false } },
    )

    expect(result.current.createOpen).toBe(false)
    expect(window.location.search).toContain("create=1")

    act(() => rerender({ canOpen: true }))

    expect(result.current.createOpen).toBe(true)
    expect(window.location.search).toBe("?source=landing")
  })

  it("ignores URLs without the create intent", () => {
    window.history.replaceState({}, "", "/characters?source=sidebar")

    const { result } = renderHook(() => useCreateCharacterIntent(true))

    expect(result.current.createOpen).toBe(false)
    expect(window.location.search).toBe("?source=sidebar")
  })
})
