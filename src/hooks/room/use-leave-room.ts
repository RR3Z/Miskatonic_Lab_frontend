"use client"

import { useMutation } from "@tanstack/react-query"
import { useRoomApiClient } from "@/hooks/room/use-room-api-client"
import { useRoomInvalidation } from "@/hooks/room/use-room-invalidation"
import { useRoomSession } from "@/hooks/room/use-room-session"
import { RoomSessionRequiredError } from "@/hooks/room/utils/room-session-required-error.util"
import { leaveRoom } from "@/lib/api/rooms"

export function useLeaveRoom() {
  const { userId } = useRoomSession()
  const api = useRoomApiClient()
  const invalidateRooms = useRoomInvalidation()

  return useMutation({
    mutationFn: (roomId: string) => {
      if (!userId) throw new RoomSessionRequiredError()
      return leaveRoom(api, roomId)
    },
    onSuccess: () => void invalidateRooms(),
  })
}
