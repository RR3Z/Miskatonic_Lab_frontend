import { HTTPError } from "ky"

export async function getApiErrorCode(error: unknown): Promise<string | null> {
  if (!(error instanceof HTTPError)) return null

  try {
    const body = (await error.response.clone().json()) as { code?: string }
    return body.code ?? null
  } catch {
    return null
  }
}
