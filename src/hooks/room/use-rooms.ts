"use client"

import { useQuery } from "@tanstack/react-query"
import { useRoomApiClient } from "@/hooks/room/use-room-api-client"
import { useRoomSession } from "@/hooks/room/use-room-session"
import { roomQueryKeys } from "@/lib/api/room-query-keys"
import { fetchRooms } from "@/lib/api/rooms"

export function useRooms() {
  const { isLoaded, userId } = useRoomSession()
  const api = useRoomApiClient()

  return useQuery({
    queryKey: userId ? roomQueryKeys.list(userId) : roomQueryKeys.all,
    queryFn: () => fetchRooms(api),
    enabled: isLoaded && Boolean(userId),
  })
}
