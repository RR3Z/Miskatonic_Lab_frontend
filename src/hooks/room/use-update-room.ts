"use client"

import { useMutation } from "@tanstack/react-query"
import { useRoomApiClient } from "@/hooks/room/use-room-api-client"
import { useRoomInvalidation } from "@/hooks/room/use-room-invalidation"
import { useRoomSession } from "@/hooks/room/use-room-session"
import { RoomSessionRequiredError } from "@/hooks/room/utils/room-session-required-error.util"
import { updateRoom } from "@/lib/api/rooms"
import type { UpdateRoomInput } from "@/types/room"

export function useUpdateRoom() {
  const { userId } = useRoomSession()
  const api = useRoomApiClient()
  const invalidateRooms = useRoomInvalidation()

  return useMutation({
    mutationFn: (input: UpdateRoomInput) => {
      if (!userId) throw new RoomSessionRequiredError()
      return updateRoom(api, input)
    },
    onSuccess: () => void invalidateRooms(),
  })
}
