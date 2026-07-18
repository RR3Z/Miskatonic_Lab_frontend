import { setTestViewport } from "@tests/utils/viewport.util"
import { describe, expect, it, vi } from "vitest"

describe("setTestViewport", () => {
  it("updates the viewport width and notifies resize listeners", () => {
    const onResize = vi.fn()
    window.addEventListener("resize", onResize)

    setTestViewport(390)

    expect(window.innerWidth).toBe(390)
    expect(onResize).toHaveBeenCalledOnce()
    window.removeEventListener("resize", onResize)
  })
})
