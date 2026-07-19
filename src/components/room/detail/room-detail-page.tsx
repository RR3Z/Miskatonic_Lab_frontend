"use client"

import { useAuth } from "@clerk/nextjs"
import { LogOut, UsersRound } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { RoomChat } from "@/components/room/chat/room-chat"
import { RoomCharacterPicker } from "@/components/room/detail/room-character-picker"
import { RoomMemberList } from "@/components/room/detail/room-member-list"
import { RoomSettings } from "@/components/room/detail/room-settings"
import { presentRoomError } from "@/components/room/utils/room-error-presenter.util"
import { Button } from "@/components/ui/button"
import roomContentRu from "@/data/room/room.ru.json"
import { useKickRoomMember } from "@/hooks/room/use-kick-room-member"
import { useLeaveRoom } from "@/hooks/room/use-leave-room"
import { appRoutes } from "@/lib/routes/app-routes"
import type { Room, RoomMember } from "@/types/room"

type RoomDetailPageProps = {
  room: Room
}

export function RoomDetailPage({ room }: RoomDetailPageProps) {
  const { userId } = useAuth()
  const router = useRouter()
  const leaveMutation = useLeaveRoom()
  const kickMutation = useKickRoomMember()
  const members = room.members ?? []
  const isOwner = room.owner_id === userId

  async function leave() {
    try {
      await leaveMutation.mutateAsync(room.id)
      toast.success(roomContentRu.detail.leaveSuccess)
      router.replace(appRoutes.rooms)
    } catch (error) {
      toast.error(presentRoomError(error))
    }
  }

  async function kick(member: RoomMember) {
    try {
      await kickMutation.mutateAsync({
        roomId: room.id,
        userId: member.user_id,
      })
      toast.success(roomContentRu.detail.kickSuccess)
    } catch (error) {
      toast.error(presentRoomError(error))
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-8 sm:py-8 lg:py-10">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <Link
            className="text-sm text-[var(--ml-ink-muted)] hover:text-[var(--ml-ink-primary)]"
            href={appRoutes.rooms}
          >
            {roomContentRu.detail.backToCatalog}
          </Link>
          <h1 className="mt-2 font-heading text-3xl font-semibold tracking-wide text-[var(--ml-ink-primary)] sm:text-4xl">
            {room.name}
          </h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-[var(--ml-ink-muted)]">
            <UsersRound aria-hidden="true" className="size-4" />
            {members.length} / {room.max_players} {roomContentRu.detail.players}
          </p>
        </div>
        <Button
          disabled={leaveMutation.isPending}
          onClick={() => void leave()}
          type="button"
          variant="destructive"
        >
          <LogOut aria-hidden="true" data-icon="inline-start" />
          {roomContentRu.detail.leave}
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-5">
          <RoomMemberList
            canKick={isOwner}
            isKicking={kickMutation.isPending}
            members={members}
            onKick={kick}
            ownerId={room.owner_id}
            userId={userId}
          />
          <RoomCharacterPicker
            members={members}
            roomId={room.id}
            userId={userId}
          />
          <RoomChat roomId={room.id} />
        </div>
        {isOwner ? <RoomSettings key={room.updated_at} room={room} /> : null}
      </div>
    </div>
  )
}
