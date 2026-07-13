import { render } from "@testing-library/react"
import type { ReactNode } from "react"

import { QueryProvider } from "@/lib/api/provider"

export function renderWithQuery(ui: ReactNode) {
  return render(<QueryProvider>{ui}</QueryProvider>)
}
