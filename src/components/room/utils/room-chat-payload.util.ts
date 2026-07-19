export function chatTextFromPayload(payload: unknown) {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "text" in payload &&
    typeof payload.text === "string"
  ) {
    return payload.text
  }
  return ""
}
