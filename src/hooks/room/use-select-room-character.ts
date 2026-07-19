"use client"

import { useMutation } from "@tanstack/react-query"
import { useRoomApiClient } from "@/hooks/room/use-room-api-client"
import { useRoomInvalidation } from "@/hooks/room/use-room-invalidation"
import { useRoomSession } from "@/hooks/room/use-room-session"
import { RoomSessionRequiredError } from "@/hooks/room/utils/room-session-required-error.util"
import { selectRoomCharacter } from "@/lib/api/rooms"
import type { SelectRoomCharacterInput } from "@/types/room"

export function useSelectRoomCharacter() {
  const { userId } = useRoomSession()
  const api = useRoomApiClient()
  const invalidateRooms = useRoomInvalidation()

  return useMutation({
    mutationFn: (input: SelectRoomCharacterInput) => {
      if (!userId) throw new RoomSessionRequiredError()
      return selectRoomCharacter(api, input)
    },
    onSuccess: () => void invalidateRooms(),
  })
}
