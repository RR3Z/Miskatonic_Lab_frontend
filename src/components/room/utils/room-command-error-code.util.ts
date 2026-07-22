export function roomCommandErrorCode(payload: unknown): string {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "code" in payload &&
    typeof payload.code === "string" &&
    payload.code.trim()
  ) {
    return payload.code
  }

  return "client.unknown_error"
}
