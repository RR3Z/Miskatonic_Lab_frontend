import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { act, renderHook, waitFor } from "@testing-library/react"
import type { ReactNode } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useRoomRealtime } from "@/hooks/room/use-room-realtime"
import { roomQueryKeys } from "@/lib/api/room-query-keys"
import type { RoomSocketEvent } from "@/types/room.types"

const mocks = vi.hoisted(() => ({
  api: {} as object,
  fetchAllRoomEvents: vi.fn(),
  fetchRoom: vi.fn(),
  getApiErrorCode: vi.fn(),
  socketOptions: undefined as unknown,
  socketStatus: "disconnected" as "connected" | "disconnected",
}))

vi.mock("@/hooks/room/use-room-session", () => ({
  useRoomSession: () => ({ userId: "owner-1" }),
}))

vi.mock("@/hooks/room/use-room-api-client", () => ({
  useRoomApiClient: () => mocks.api,
}))

vi.mock("@/lib/api/rooms", () => ({
  fetchAllRoomEvents: (...args: unknown[]) => mocks.fetchAllRoomEvents(...args),
  fetchRoom: (...args: unknown[]) => mocks.fetchRoom(...args),
}))

vi.mock("@/lib/api/errors", () => ({
  getApiErrorCode: (...args: unknown[]) => mocks.getApiErrorCode(...args),
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
    mocks.fetchAllRoomEvents.mockReset()
    mocks.fetchAllRoomEvents.mockResolvedValue([])
    mocks.fetchRoom.mockReset()
    mocks.getApiErrorCode.mockReset()
    mocks.socketOptions = undefined
    mocks.socketStatus = "disconnected"
  })

  it("syncs missing events before refreshing the current room snapshot", async () => {
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
    expect(mocks.fetchAllRoomEvents).toHaveBeenCalledWith(
      mocks.api,
      "room-1",
      0,
    )
    expect(refetchQueries).toHaveBeenNthCalledWith(1, {
      queryKey: roomQueryKeys.detail("owner-1", "room-1"),
      type: "active",
    })
    expect(refetchQueries).toHaveBeenNthCalledWith(2, {
      queryKey: roomQueryKeys.selectedCharacters("owner-1", "room-1"),
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
    expect(mocks.fetchAllRoomEvents).toHaveBeenCalledWith(
      mocks.api,
      "room-1",
      0,
    )
    expect(refetchQueries).toHaveBeenNthCalledWith(1, {
      queryKey: roomQueryKeys.detail("owner-1", "room-1"),
      type: "active",
    })
    expect(refetchQueries).toHaveBeenNthCalledWith(2, {
      queryKey: roomQueryKeys.selectedCharacters("owner-1", "room-1"),
      type: "active",
    })
  })

  it("uses the latest cached sequence as the recovery cursor", async () => {
    const queryClient = new QueryClient()
    queryClient.setQueryData(roomQueryKeys.events("owner-1", "room-1"), [
      {
        actor_id: "owner-1",
        created_at: "2026-07-22T12:00:00Z",
        id: "event-7",
        payload: {},
        room_id: "room-1",
        sequence: 7,
        type: "chat.message",
      },
    ])
    mocks.fetchAllRoomEvents.mockResolvedValue([
      {
        actor_id: "player-1",
        created_at: "2026-07-22T12:01:00Z",
        id: "event-8",
        payload: { text: "Recovered" },
        room_id: "room-1",
        sequence: 8,
        type: "chat.message",
      },
    ])
    mocks.socketStatus = "connected"

    renderHook(() => useRoomRealtime({ roomId: "room-1" }), {
      wrapper: testWrapper(queryClient),
    })

    await waitFor(() =>
      expect(mocks.fetchAllRoomEvents).toHaveBeenCalledWith(
        mocks.api,
        "room-1",
        7,
      ),
    )
    expect(
      queryClient.getQueryData(roomQueryKeys.events("owner-1", "room-1")),
    ).toHaveLength(2)
  })

  it("ends the room session after a terminal websocket close", async () => {
    const queryClient = new QueryClient()
    const onTerminalClose = vi.fn()

    renderHook(() => useRoomRealtime({ onTerminalClose, roomId: "room-1" }), {
      wrapper: testWrapper(queryClient),
    })

    const socketOptions = mocks.socketOptions as {
      enabled: boolean
      onTerminalClose: () => void
    }
    act(() => socketOptions.onTerminalClose())

    await waitFor(() => expect(onTerminalClose).toHaveBeenCalledOnce())
    expect((mocks.socketOptions as { enabled: boolean }).enabled).toBe(false)
  })

  it("ends the room session when a reconnect probe finds no room", async () => {
    const queryClient = new QueryClient()
    const onTerminalClose = vi.fn()
    const refetchQueries = vi
      .spyOn(queryClient, "refetchQueries")
      .mockResolvedValue(undefined)
    mocks.socketStatus = "connected"

    const { rerender } = renderHook(
      () => useRoomRealtime({ onTerminalClose, roomId: "room-1" }),
      { wrapper: testWrapper(queryClient) },
    )
    await waitFor(() => expect(refetchQueries).toHaveBeenCalledTimes(2))

    mocks.fetchRoom.mockRejectedValue(new Error("room gone"))
    mocks.getApiErrorCode.mockResolvedValue("room.not_found")
    mocks.socketStatus = "disconnected"
    rerender()

    await waitFor(() => expect(onTerminalClose).toHaveBeenCalledOnce())
    expect(mocks.fetchRoom).toHaveBeenCalledWith(mocks.api, "room-1")
  })
})
