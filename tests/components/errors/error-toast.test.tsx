import { act, render, screen } from "@testing-library/react"
import { toast } from "sonner"
import { afterEach, describe, expect, it } from "vitest"

import { showErrorCode } from "@/components/errors/utils/error-toast.util"
import { GenericToaster } from "@/components/ui/sonner/generic-toaster"
import { getPresentedError } from "@/lib/errors/catalog"
import { appRoutes } from "@/lib/routes/app-routes"

describe("error toast", () => {
  afterEach(() => {
    toast.dismiss()
  })

  it("shows the raw code, fallback copy, action, and details link", async () => {
    const rawCode = "future.backend_error"
    const entry = getPresentedError(rawCode)
    render(<GenericToaster />)

    act(() => {
      showErrorCode(rawCode)
    })

    expect(
      await screen.findByText(`${rawCode} — ${entry.title}`),
    ).toBeInTheDocument()
    expect(screen.getByText(entry.toastSummary)).toBeInTheDocument()
    expect(screen.getByText(entry.action)).toBeInTheDocument()
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      appRoutes.error(rawCode),
    )
  })
})
