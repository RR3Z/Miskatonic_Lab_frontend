"use client"

import { useQuery } from "@tanstack/react-query"

import { useRoomApiClient } from "@/hooks/room/use-room-api-client"
import { useRoomSession } from "@/hooks/room/use-room-session"
import { roomQueryKeys } from "@/lib/api/room-query-keys"
import { fetchRoomSelectedCharacters } from "@/lib/api/rooms"

export function useRoomSelectedCharacters(roomId: string) {
  const { isLoaded, userId } = useRoomSession()
  const api = useRoomApiClient()

  return useQuery({
    queryKey: userId
      ? roomQueryKeys.selectedCharacters(userId, roomId)
      : roomQueryKeys.all,
    queryFn: () => fetchRoomSelectedCharacters(api, roomId),
    enabled: isLoaded && Boolean(userId) && Boolean(roomId),
  })
}
