import type { RoomSocketEvent } from "@/types/room.types"

export function parseRoomSocketEvent(value: unknown): RoomSocketEvent | null {
  if (typeof value !== "string") return null
  try {
    const event: unknown = JSON.parse(value)
    if (
      typeof event !== "object" ||
      event === null ||
      !("type" in event) ||
      !("room_id" in event) ||
      !("actor_id" in event) ||
      typeof event.type !== "string" ||
      typeof event.room_id !== "string" ||
      typeof event.actor_id !== "string" ||
      ("sequence" in event &&
        (typeof event.sequence !== "number" ||
          !Number.isSafeInteger(event.sequence) ||
          event.sequence <= 0))
    ) {
      return null
    }
    return event as RoomSocketEvent
  } catch {
    return null
  }
}
