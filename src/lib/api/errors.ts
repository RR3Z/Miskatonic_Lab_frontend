import { resolveErrorCode } from "@/lib/errors/resolve-error-code"

export async function getApiErrorCode(error: unknown): Promise<string | null> {
  const code = await resolveErrorCode(error)
  return code.startsWith("client.") ? null : code
}
