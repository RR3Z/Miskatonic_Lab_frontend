import { hasErrorCode, UNKNOWN_ERROR_CODE } from "@/lib/errors/catalog"

const NETWORK_ERROR_CODE = "client.network_unavailable"

function codeFromData(value: unknown): string | null {
  if (typeof value !== "object" || value === null || !("code" in value))
    return null
  return typeof value.code === "string" ? value.code : null
}

export async function resolveErrorCode(error: unknown): Promise<string> {
  if (typeof error !== "object" || error === null) return NETWORK_ERROR_CODE

  if ("data" in error) {
    const code = codeFromData(error.data)
    if (code) return hasErrorCode(code) ? code : UNKNOWN_ERROR_CODE
  }

  if ("response" in error && error.response instanceof Response) {
    try {
      const code = codeFromData(await error.response.clone().json())
      if (code) return hasErrorCode(code) ? code : UNKNOWN_ERROR_CODE
      return UNKNOWN_ERROR_CODE
    } catch {
      return UNKNOWN_ERROR_CODE
    }
  }

  return NETWORK_ERROR_CODE
}
