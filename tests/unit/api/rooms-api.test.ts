import { describe, expect, it, vi } from "vitest"

import {
  fetchAllRoomEvents,
  fetchRoomEvents,
  roomEventsPageSize,
} from "@/lib/api/rooms"

function roomEvent(sequence: number) {
  return {
    actor_id: "user-1",
    created_at: "2026-07-22T12:00:00Z",
    id: `event-${sequence}`,
    payload: {},
    room_id: "room-1",
    sequence,
    type: "chat.message",
  }
}

describe("room events API", () => {
  it("sends the persisted sequence as the recovery cursor", async () => {
    const json = vi.fn().mockResolvedValue([])
    const get = vi.fn(() => ({ json }))

    await fetchRoomEvents({ get } as never, "room-1", 42)

    expect(get).toHaveBeenCalledWith(
      "api/rooms/room-1/events?limit=200&after=42",
    )
  })

  it("loads every cursor page in sequence order", async () => {
    const firstPage = Array.from({ length: roomEventsPageSize }, (_, index) =>
      roomEvent(index + 1),
    )
    const get = vi
      .fn()
      .mockReturnValueOnce({ json: vi.fn().mockResolvedValue(firstPage) })
      .mockReturnValueOnce({
        json: vi.fn().mockResolvedValue([roomEvent(201)]),
      })

    const events = await fetchAllRoomEvents({ get } as never, "room-1")

    expect(events).toHaveLength(201)
    expect(get).toHaveBeenNthCalledWith(1, "api/rooms/room-1/events?limit=200")
    expect(get).toHaveBeenNthCalledWith(
      2,
      "api/rooms/room-1/events?limit=200&after=200",
    )
  })
})
