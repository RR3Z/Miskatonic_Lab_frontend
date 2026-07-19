import type { KyInstance } from "ky"

import type {
  ChangeRoomMemberRoleInput,
  CreateRoomInput,
  JoinRoomInput,
  Room,
  RoomEvent,
  RoomMember,
  RoomSummary,
  SelectRoomCharacterInput,
  TransferRoomOwnershipInput,
  UpdateRoomInput,
} from "@/types/room"

export function fetchRooms(api: KyInstance): Promise<RoomSummary[]> {
  return api.get("api/rooms/").json<RoomSummary[]>()
}

export function createRoom(
  api: KyInstance,
  input: CreateRoomInput,
): Promise<Room> {
  return api
    .post("api/rooms/", {
      json: {
        name: input.name?.trim() || undefined,
        max_players: input.maxPlayers,
        password: input.password,
      },
    })
    .json<Room>()
}

export function joinRoom(
  api: KyInstance,
  input: JoinRoomInput,
): Promise<RoomMember> {
  return api
    .post(`api/rooms/${input.roomId}/join`, {
      json: {
        invite_token: input.inviteToken?.trim() || undefined,
        password: input.password?.trim() || undefined,
      },
    })
    .json<RoomMember>()
}

export function fetchRoom(api: KyInstance, roomId: string): Promise<Room> {
  return api.get(`api/rooms/${roomId}/`).json<Room>()
}

export function fetchRoomEvents(
  api: KyInstance,
  roomId: string,
): Promise<RoomEvent[]> {
  return api.get(`api/rooms/${roomId}/events?limit=100`).json<RoomEvent[]>()
}

export function updateRoom(
  api: KyInstance,
  input: UpdateRoomInput,
): Promise<Room> {
  return api
    .put(`api/rooms/${input.roomId}/`, {
      json: {
        max_players: input.maxPlayers,
        name: input.name?.trim() || undefined,
        password: input.password?.trim() || undefined,
      },
    })
    .json<Room>()
}

export async function leaveRoom(
  api: KyInstance,
  roomId: string,
): Promise<void> {
  await api.delete(`api/rooms/${roomId}/leave`)
}

export async function kickRoomMember(
  api: KyInstance,
  roomId: string,
  userId: string,
): Promise<void> {
  await api.delete(`api/rooms/${roomId}/kick/${userId}`)
}

export function changeRoomMemberRole(
  api: KyInstance,
  input: ChangeRoomMemberRoleInput,
): Promise<RoomMember> {
  return api
    .put(`api/rooms/${input.roomId}/members/${input.userId}/role`, {
      json: { role: input.role },
    })
    .json<RoomMember>()
}

export function transferRoomOwnership(
  api: KyInstance,
  input: TransferRoomOwnershipInput,
): Promise<Room> {
  return api
    .put(`api/rooms/${input.roomId}/owner`, {
      json: { user_id: input.userId },
    })
    .json<Room>()
}

export function selectRoomCharacter(
  api: KyInstance,
  input: SelectRoomCharacterInput,
): Promise<RoomMember> {
  return api
    .put(`api/rooms/${input.roomId}/character`, {
      json: { character_id: input.characterId },
    })
    .json<RoomMember>()
}
