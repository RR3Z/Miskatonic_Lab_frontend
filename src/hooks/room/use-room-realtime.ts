"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useCallback, useEffect, useRef, useState } from "react"

import { useRoomApiClient } from "@/hooks/room/use-room-api-client"
import { useRoomSession } from "@/hooks/room/use-room-session"
import { useRoomSocket } from "@/hooks/room/use-room-socket"
import { getApiErrorCode } from "@/lib/api/errors"
import { roomQueryKeys } from "@/lib/api/room-query-keys"
import { fetchAllRoomEvents, fetchRoom } from "@/lib/api/rooms"
import type { RoomEvent, RoomSocketEvent } from "@/types/room"

type UseRoomRealtimeOptions = {
  onEvent?: (event: RoomSocketEvent) => boolean | undefined
  onTerminalClose?: () => void
  roomId: string
}

export function useRoomRealtime({
  onEvent,
  onTerminalClose,
  roomId,
}: UseRoomRealtimeOptions) {
  const queryClient = useQueryClient()
  const api = useRoomApiClient()
  const { userId } = useRoomSession()
  const [isTerminal, setIsTerminal] = useState(false)
  const connectedRef = useRef(false)
  const previousRoomIdRef = useRef(roomId)

  const endRoomSession = useCallback(() => {
    setIsTerminal(true)
    onTerminalClose?.()
  }, [onTerminalClose])

  useEffect(() => {
    if (previousRoomIdRef.current === roomId) return
    previousRoomIdRef.current = roomId
    setIsTerminal(false)
    connectedRef.current = false
  }, [roomId])
  const syncRoomEvents = useCallback(async () => {
    if (!userId) return

    const queryKey = roomQueryKeys.events(userId, roomId)
    const cachedEvents = queryClient.getQueryData<RoomEvent[]>(queryKey) ?? []
    const afterSequence = latestRoomEventSequence(cachedEvents)
    const recoveredEvents = await fetchAllRoomEvents(api, roomId, afterSequence)
    if (recoveredEvents.length === 0) return

    queryClient.setQueryData<RoomEvent[]>(queryKey, (currentEvents = []) =>
      mergeRoomEvents(currentEvents, recoveredEvents),
    )
  }, [api, queryClient, roomId, userId])

  const refreshRoomSnapshot = useCallback(async () => {
    if (!userId) return

    await syncRoomEvents()

    await queryClient.refetchQueries({
      queryKey: roomQueryKeys.detail(userId, roomId),
      type: "active",
    })
    await queryClient.refetchQueries({
      queryKey: roomQueryKeys.selectedCharacters(userId, roomId),
      type: "active",
    })
  }, [queryClient, roomId, syncRoomEvents, userId])

  const verifyRoomAccess = useCallback(async () => {
    try {
      await fetchRoom(api, roomId)
    } catch (error) {
      const code = await getApiErrorCode(error)
      if (code === "room.not_found" || code === "room.not_member") {
        endRoomSession()
      }
    }
  }, [api, endRoomSession, roomId])

  const handleEvent = useCallback(
    (event: RoomSocketEvent) => {
      if (onEvent?.(event) === false) return
      void refreshRoomSnapshot()
    },
    [onEvent, refreshRoomSnapshot],
  )

  const socket = useRoomSocket({
    enabled: Boolean(userId) && !isTerminal,
    onEvent: handleEvent,
    onTerminalClose: endRoomSession,
    roomId,
  })

  useEffect(() => {
    if (socket.status === "connected") {
      connectedRef.current = true
      void refreshRoomSnapshot()
      return
    }
    if (
      socket.status === "disconnected" &&
      connectedRef.current &&
      !isTerminal
    ) {
      void verifyRoomAccess()
    }
  }, [isTerminal, refreshRoomSnapshot, socket.status, verifyRoomAccess])

  return socket
}

function latestRoomEventSequence(events: RoomEvent[]) {
  return events.reduce((latest, event) => Math.max(latest, event.sequence), 0)
}

function mergeRoomEvents(
  currentEvents: RoomEvent[],
  recoveredEvents: RoomEvent[],
) {
  const uniqueEvents = new Map<number, RoomEvent>()
  for (const event of [...currentEvents, ...recoveredEvents]) {
    uniqueEvents.set(event.sequence, event)
  }

  return [...uniqueEvents.values()].sort(
    (first, second) => first.sequence - second.sequence,
  )
}
