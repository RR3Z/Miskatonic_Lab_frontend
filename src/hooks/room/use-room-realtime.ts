"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useCallback, useEffect } from "react"

import { useRoomSession } from "@/hooks/room/use-room-session"
import { useRoomSocket } from "@/hooks/room/use-room-socket"
import { roomQueryKeys } from "@/lib/api/room-query-keys"
import type { RoomSocketEvent } from "@/types/room"

type UseRoomRealtimeOptions = {
  onEvent?: (event: RoomSocketEvent) => boolean | undefined
  roomId: string
}

export function useRoomRealtime({ onEvent, roomId }: UseRoomRealtimeOptions) {
  const queryClient = useQueryClient()
  const { userId } = useRoomSession()
  const refreshRoomSnapshot = useCallback(async () => {
    if (!userId) return

    await queryClient.refetchQueries({
      queryKey: roomQueryKeys.detail(userId, roomId),
      type: "active",
    })
    await queryClient.refetchQueries({
      queryKey: roomQueryKeys.events(userId, roomId),
      type: "active",
    })
  }, [queryClient, roomId, userId])

  const handleEvent = useCallback(
    (event: RoomSocketEvent) => {
      if (onEvent?.(event) === false) return
      void refreshRoomSnapshot()
    },
    [onEvent, refreshRoomSnapshot],
  )

  const socket = useRoomSocket({
    enabled: Boolean(userId),
    onEvent: handleEvent,
    roomId,
  })

  useEffect(() => {
    if (socket.status === "connected") void refreshRoomSnapshot()
  }, [refreshRoomSnapshot, socket.status])

  return socket
}
