export function roomEventUserId(payload: unknown): string | null {
  if (
    typeof payload !== "object" ||
    payload === null ||
    !("user_id" in payload) ||
    typeof payload.user_id !== "string"
  ) {
    return null
  }

  return payload.user_id
}
