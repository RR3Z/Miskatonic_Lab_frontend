export async function getApiErrorCode(error: unknown): Promise<string | null> {
  if (typeof error !== "object" || error === null || !("data" in error)) {
    return null
  }

  const data = error.data
  if (typeof data !== "object" || data === null || !("code" in data)) {
    return null
  }

  return typeof data.code === "string" ? data.code : null
}
