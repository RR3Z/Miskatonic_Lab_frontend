"use client"

import { useMutation } from "@tanstack/react-query"
import { useRoomApiClient } from "@/hooks/room/use-room-api-client"
import { useRoomInvalidation } from "@/hooks/room/use-room-invalidation"
import { useRoomSession } from "@/hooks/room/use-room-session"
import { RoomSessionRequiredError } from "@/hooks/room/utils/room-session-required-error.util"
import { kickRoomMember } from "@/lib/api/rooms"

type KickRoomMemberInput = {
  roomId: string
  userId: string
}

export function useKickRoomMember() {
  const { userId } = useRoomSession()
  const api = useRoomApiClient()
  const invalidateRooms = useRoomInvalidation()

  return useMutation({
    mutationFn: ({ roomId, userId: memberId }: KickRoomMemberInput) => {
      if (!userId) throw new RoomSessionRequiredError()
      return kickRoomMember(api, roomId, memberId)
    },
    onSuccess: () => void invalidateRooms(),
  })
}
