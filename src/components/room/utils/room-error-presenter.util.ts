import roomErrorsRu from "@/data/errors/room-errors.ru.json"
import roomContentRu from "@/data/room/room.ru.json"

type RoomErrorCode = keyof typeof roomErrorsRu

export function getRoomErrorCode(error: unknown) {
  if (typeof error !== "object" || error === null || !("data" in error)) {
    return "network.error" as const
  }

  const { data } = error
  if (typeof data !== "object" || data === null || !("code" in data)) {
    return "unknown.error" as const
  }

  const code = data.code
  return typeof code === "string" && code in roomErrorsRu
    ? (code as RoomErrorCode)
    : "unknown.error"
}

export function presentRoomError(error: unknown) {
  const code = getRoomErrorCode(error)
  const entry = roomErrorsRu[code]
  return `${code} — ${entry.title}. ${entry.message} ${roomContentRu.errors.actionLabel}: ${entry.action}`
}
