import { resolveError } from "@/lib/errors/utils/resolve-error-code.util"

export async function getApiErrorCode(error: unknown): Promise<string | null> {
  const resolved = await resolveError(error)
  return resolved.source === "backend" ? resolved.rawCode : null
}
