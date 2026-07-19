import type { RoomMember } from "@/types/room"

const emptyCharacterID = "00000000-0000-0000-0000-000000000000"

export function hasRoomCharacter(member: RoomMember | undefined) {
  return Boolean(
    member?.character_id && member.character_id !== emptyCharacterID,
  )
}
