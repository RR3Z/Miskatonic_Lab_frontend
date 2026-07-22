"use client"

import { useMutation } from "@tanstack/react-query"
import { useRoomApiClient } from "@/hooks/room/use-room-api-client"
import { useRoomInvalidation } from "@/hooks/room/use-room-invalidation"
import { useRoomSession } from "@/hooks/room/use-room-session"
import { RoomSessionRequiredError } from "@/hooks/room/utils/room-session-required-error.util"
import { createRoom } from "@/lib/api/rooms"
import type { CreateRoomInput } from "@/types/room.types"

export function useCreateRoom() {
  const { userId } = useRoomSession()
  const api = useRoomApiClient()
  const invalidateRooms = useRoomInvalidation()

  return useMutation({
    mutationFn: (input: CreateRoomInput) => {
      if (!userId) throw new RoomSessionRequiredError()
      return createRoom(api, input)
    },
    onSettled: () => void invalidateRooms(),
  })
}
