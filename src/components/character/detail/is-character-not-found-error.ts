export function isCharacterNotFoundError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    error.response instanceof Response &&
    error.response.status === 404
  )
}
