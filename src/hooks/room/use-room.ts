"use client"

import { useQuery } from "@tanstack/react-query"
import { useRoomApiClient } from "@/hooks/room/use-room-api-client"
import { useRoomSession } from "@/hooks/room/use-room-session"
import { roomQueryKeys } from "@/lib/api/room-query-keys"
import { fetchRoom } from "@/lib/api/rooms"

export function useRoom(roomId: string) {
  const { isLoaded, userId } = useRoomSession()
  const api = useRoomApiClient()

  return useQuery({
    queryKey: userId ? roomQueryKeys.detail(userId, roomId) : roomQueryKeys.all,
    queryFn: () => fetchRoom(api, roomId),
    enabled: isLoaded && Boolean(userId) && Boolean(roomId),
    retry: false,
  })
}
