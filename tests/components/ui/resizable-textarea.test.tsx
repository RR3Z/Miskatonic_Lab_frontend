import { render, screen, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { ResizableTextarea } from "@/components/ui/resizable-textarea"

type ObserverRegistration = {
  callback: ResizeObserverCallback
  target: Element
}

const registrations: ObserverRegistration[] = []

class ResizeObserverMock implements ResizeObserver {
  constructor(readonly callback: ResizeObserverCallback) {}

  disconnect = vi.fn()

  observe = (target: Element) => {
    registrations.push({ callback: this.callback, target })
  }

  unobserve = vi.fn()
}

describe("ResizableTextarea", () => {
  const originalResizeObserver = globalThis.ResizeObserver

  beforeEach(() => {
    registrations.length = 0
    window.localStorage.clear()
    vi.stubGlobal("ResizeObserver", ResizeObserverMock)
  })

  afterEach(() => {
    vi.stubGlobal("ResizeObserver", originalResizeObserver)
  })

  it("stores a manual height and restores it for the same editor", async () => {
    const storageKey = "miskatonic-character-note-editor-height:character:note"
    const { unmount } = render(
      <ResizableTextarea
        aria-label="Текст заметки"
        onChange={vi.fn()}
        storageKey={storageKey}
        value="Старый текст"
      />,
    )
    const container = screen
      .getByRole("textbox", { name: "Текст заметки" })
      .closest('[data-slot="resizable-textarea"]')
    expect(container).toBeInTheDocument()

    const registration = registrations.find(
      (candidate) => candidate.target === container,
    )
    expect(registration).toBeDefined()
    registration?.callback(
      [{ contentRect: { height: 144 } } as ResizeObserverEntry],
      {} as ResizeObserver,
    )

    await waitFor(() =>
      expect(window.localStorage.getItem(storageKey)).toBe("144"),
    )
    expect(container).toHaveStyle({ height: "144px" })

    unmount()
    render(
      <ResizableTextarea
        aria-label="Текст заметки"
        onChange={vi.fn()}
        storageKey={storageKey}
        value="Старый текст"
      />,
    )

    expect(
      screen
        .getByRole("textbox", { name: "Текст заметки" })
        .closest('[data-slot="resizable-textarea"]'),
    ).toHaveStyle({ height: "144px" })
  })
})
