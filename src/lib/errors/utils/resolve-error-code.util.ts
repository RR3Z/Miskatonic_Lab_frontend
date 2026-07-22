import { hasErrorCode, UNKNOWN_ERROR_CODE } from "@/lib/errors/catalog"
import type { ResolvedError } from "@/lib/errors/types/resolved-error.types"

const NETWORK_ERROR_CODE = "client.network_unavailable"

function codeFromData(value: unknown): string | null {
  if (typeof value !== "object" || value === null || !("code" in value))
    return null
  return typeof value.code === "string" ? value.code : null
}

function resolvedError(
  rawCode: string,
  source: ResolvedError["source"],
): ResolvedError {
  const isKnown = hasErrorCode(rawCode)

  return {
    rawCode,
    catalogCode: isKnown ? rawCode : UNKNOWN_ERROR_CODE,
    isKnown,
    source,
  }
}

function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError) return true
  if (typeof error !== "object" || error === null || !("name" in error))
    return false

  return error.name === "AbortError" || error.name === "TimeoutError"
}

export async function resolveError(error: unknown): Promise<ResolvedError> {
  if (typeof error !== "object" || error === null)
    return resolvedError(UNKNOWN_ERROR_CODE, "client")

  if ("data" in error) {
    const code = codeFromData(error.data)
    if (code) return resolvedError(code, "backend")
  }

  if ("response" in error && error.response instanceof Response) {
    try {
      const code = codeFromData(await error.response.clone().json())
      if (code) return resolvedError(code, "backend")
      return resolvedError(UNKNOWN_ERROR_CODE, "backend")
    } catch {
      return resolvedError(UNKNOWN_ERROR_CODE, "backend")
    }
  }

  return isNetworkError(error)
    ? resolvedError(NETWORK_ERROR_CODE, "network")
    : resolvedError(UNKNOWN_ERROR_CODE, "client")
}
