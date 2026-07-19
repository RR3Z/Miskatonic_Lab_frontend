import { afterEach, describe, expect, it, vi } from "vitest"

import { roomWebSocketURL } from "@/hooks/room/use-room-socket"

describe("roomWebSocketURL", () => {
  afterEach(() => vi.unstubAllEnvs())

  it("converts the API origin to a websocket URL without an access token", () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.example.test/base/")

    expect(roomWebSocketURL("room with spaces")).toBe(
      "wss://api.example.test/base/api/rooms/room%20with%20spaces/ws",
    )
  })
})
