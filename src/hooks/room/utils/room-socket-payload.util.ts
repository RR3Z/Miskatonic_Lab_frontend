import type { RoomSocketEvent } from "@/types/room"

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
      typeof event.actor_id !== "string"
    ) {
      return null
    }
    return event as RoomSocketEvent
  } catch {
    return null
  }
}
