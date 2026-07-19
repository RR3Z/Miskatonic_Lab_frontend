"use client"

import { useRouter } from "next/navigation"

import { RoomDetailPage } from "@/components/room/detail/room-detail-page"
import { RoomJoinForm } from "@/components/room/join/room-join-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import roomContentRu from "@/data/room/room.ru.json"
import { useRoom } from "@/hooks/room/use-room"
import { appRoutes } from "@/lib/routes/app-routes"

import { RoomAccessLayout } from "./room-access-layout"

type RoomAccessPageProps = {
  inviteToken?: string
  roomId: string
}

export function RoomAccessPage({ inviteToken, roomId }: RoomAccessPageProps) {
  const router = useRouter()
  const { data: room, isLoading, refetch } = useRoom(roomId)

  if (isLoading) {
    return (
      <RoomAccessLayout>
        <Card className="w-full border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel)]">
          <CardContent className="py-10 text-center text-[var(--ml-ink-muted)]">
            {roomContentRu.join.loading}
          </CardContent>
        </Card>
      </RoomAccessLayout>
    )
  }

  if (room) return <RoomDetailPage room={room} />

  return (
    <RoomAccessLayout>
      <Card className="w-full border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel)]">
        <CardHeader>
          <CardTitle className="text-3xl">{roomContentRu.join.title}</CardTitle>
          <CardDescription>{roomContentRu.join.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <RoomJoinForm
            inviteToken={inviteToken}
            onJoined={() => {
              router.replace(appRoutes.room(roomId))
              void refetch()
            }}
            roomId={roomId}
          />
        </CardContent>
      </Card>
    </RoomAccessLayout>
  )
}
