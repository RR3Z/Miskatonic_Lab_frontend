import type { CharacterDetail } from "@/types/character"

export type RoomSummary = {
  id: string
  name: string
  max_players: number
  member_count: number
  created_at: string
  is_member: boolean
}

export type Room = {
  id: string
  name: string
  owner_id: string
  max_players: number
  invite_token?: string
  created_at: string
  updated_at: string
  last_activity_at: string
  members?: RoomMember[]
}

export type CreateRoomInput = {
  name?: string
  maxPlayers: number
  password: string
}

export type JoinRoomInput = {
  roomId: string
  inviteToken?: string
  password?: string
}

export type RoomMember = {
  id: string
  room_id: string
  user_id: string
  username?: string
  character_id: string
  role: RoomRole
  joined_at: string
}

export type RoomRole = "gm" | "player"

export type ChangeRoomMemberRoleInput = {
  roomId: string
  userId: string
  role: RoomRole
}

export type TransferRoomOwnershipInput = {
  roomId: string
  userId: string
}

export type UpdateRoomInput = {
  roomId: string
  name?: string
  maxPlayers: number
  password?: string
}

export type SelectRoomCharacterInput = {
  roomId: string
  characterId: string
}

export type RoomEvent = {
  id: string
  room_id: string
  sequence: number
  actor_id: string
  type: string
  payload: unknown
  created_at: string
}

export type RoomSocketEvent = {
  type: string
  room_id: string
  sequence?: number
  actor_id: string
  payload?: unknown
}

export type RoomSelectedCharacter = {
  member_id: string
  user_id: string
  role: RoomRole
  character: CharacterDetail
}
