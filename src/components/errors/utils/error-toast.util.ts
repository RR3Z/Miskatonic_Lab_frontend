import { createElement } from "react"
import { toast } from "sonner"

import { ErrorToastDescription } from "@/components/errors/error-toast-description"
import { getPresentedError } from "@/lib/errors/catalog"
import { resolveError } from "@/lib/errors/utils/resolve-error-code.util"

export async function showError(error: unknown, id?: string) {
  const resolved = await resolveError(error)
  return showErrorCode(resolved.rawCode, id)
}

export function showErrorCode(code: string, id?: string) {
  const entry = getPresentedError(code)

  return toast.error(`${entry.code} — ${entry.title}`, {
    description: createElement(ErrorToastDescription, { code: entry.code }),
    id,
  })
}
