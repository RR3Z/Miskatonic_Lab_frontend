import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { act, renderHook, waitFor } from "@testing-library/react"
import type { ReactNode } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useRoomRealtime } from "@/hooks/room/use-room-realtime"
import { roomQueryKeys } from "@/lib/api/room-query-keys"
import type { RoomSocketEvent } from "@/types/room"

const mocks = vi.hoisted(() => ({
  socketOptions: undefined as unknown,
  socketStatus: "disconnected" as "connected" | "disconnected",
}))

vi.mock("@/hooks/room/use-room-session", () => ({
  useRoomSession: () => ({ userId: "owner-1" }),
}))

vi.mock("@/hooks/room/use-room-socket", () => ({
  useRoomSocket: (options: unknown) => {
    mocks.socketOptions = options
    return {
      send: vi.fn(),
      status: mocks.socketStatus,
    }
  },
}))

function testWrapper(queryClient: QueryClient) {
  return function TestWrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }
}

describe("useRoomRealtime", () => {
  beforeEach(() => {
    mocks.socketOptions = undefined
    mocks.socketStatus = "disconnected"
  })

  it("refetches current room snapshot before event history", async () => {
    const queryClient = new QueryClient()
    const refetchQueries = vi
      .spyOn(queryClient, "refetchQueries")
      .mockResolvedValue(undefined)

    renderHook(() => useRoomRealtime({ roomId: "room-1" }), {
      wrapper: testWrapper(queryClient),
    })

    const socketOptions = mocks.socketOptions as {
      onEvent: (event: RoomSocketEvent) => void
    }
    act(() => {
      socketOptions.onEvent({
        actor_id: "previous-owner",
        payload: { new_owner_id: "owner-1" },
        room_id: "room-1",
        type: "owner.transferred",
      })
    })

    await waitFor(() => expect(refetchQueries).toHaveBeenCalledTimes(2))
    expect(refetchQueries).toHaveBeenNthCalledWith(1, {
      queryKey: roomQueryKeys.detail("owner-1", "room-1"),
      type: "active",
    })
    expect(refetchQueries).toHaveBeenNthCalledWith(2, {
      queryKey: roomQueryKeys.events("owner-1", "room-1"),
      type: "active",
    })
  })

  it("refetches snapshot and history after websocket reconnect", async () => {
    const queryClient = new QueryClient()
    const refetchQueries = vi
      .spyOn(queryClient, "refetchQueries")
      .mockResolvedValue(undefined)

    const { rerender } = renderHook(
      () => useRoomRealtime({ roomId: "room-1" }),
      { wrapper: testWrapper(queryClient) },
    )

    mocks.socketStatus = "connected"
    rerender()

    await waitFor(() => expect(refetchQueries).toHaveBeenCalledTimes(2))
    expect(refetchQueries).toHaveBeenNthCalledWith(1, {
      queryKey: roomQueryKeys.detail("owner-1", "room-1"),
      type: "active",
    })
    expect(refetchQueries).toHaveBeenNthCalledWith(2, {
      queryKey: roomQueryKeys.events("owner-1", "room-1"),
      type: "active",
    })
  })
})
