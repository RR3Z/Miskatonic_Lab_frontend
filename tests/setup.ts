import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import {
  DEFAULT_TEST_VIEWPORT_WIDTH,
  setTestViewport,
} from "@tests/utils/viewport.util"
import { afterAll, afterEach, beforeAll, vi } from "vitest"
import { server } from "./mocks/server"

function matchesMediaQuery(query: string) {
  const minWidth = query.match(/min-width:\s*(\d+)px/)
  const maxWidth = query.match(/max-width:\s*(\d+)px/)

  return (
    (!minWidth || window.innerWidth >= Number(minWidth[1])) &&
    (!maxWidth || window.innerWidth <= Number(maxWidth[1]))
  )
}

Object.defineProperty(window, "matchMedia", {
  configurable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    addEventListener: vi.fn(),
    addListener: vi.fn(),
    dispatchEvent: vi.fn(),
    matches: matchesMediaQuery(query),
    media: query,
    onchange: null,
    removeEventListener: vi.fn(),
    removeListener: vi.fn(),
  })),
  writable: true,
})

class ResizeObserverMock implements ResizeObserver {
  disconnect = vi.fn()
  observe = vi.fn()
  unobserve = vi.fn()
}

Object.defineProperty(globalThis, "ResizeObserver", {
  configurable: true,
  value: ResizeObserverMock,
  writable: true,
})

Object.defineProperties(HTMLElement.prototype, {
  getAnimations: {
    configurable: true,
    value: vi.fn(() => []),
  },
  hasPointerCapture: {
    configurable: true,
    value: vi.fn(() => false),
  },
  releasePointerCapture: {
    configurable: true,
    value: vi.fn(),
  },
  scrollIntoView: {
    configurable: true,
    value: vi.fn(),
  },
  setPointerCapture: {
    configurable: true,
    value: vi.fn(),
  },
})

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" })
})

afterEach(() => {
  cleanup()
  server.resetHandlers()
  setTestViewport(DEFAULT_TEST_VIEWPORT_WIDTH)
})

afterAll(() => {
  server.close()
})
