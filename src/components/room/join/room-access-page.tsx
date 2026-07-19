"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { toast } from "sonner"

import { RoomDetailPage } from "@/components/room/detail/room-detail-page"
import { RoomJoinForm } from "@/components/room/join/room-join-form"
import { isRoomJoinRequiredError } from "@/components/room/join/utils/is-room-join-required.util"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import roomContentRu from "@/data/room/room.ru.json"
import { useJoinRoom } from "@/hooks/room/use-join-room"
import { useRoom } from "@/hooks/room/use-room"
import { showError } from "@/lib/errors/presenter"
import { appRoutes } from "@/lib/routes/app-routes"

import { RoomAccessLayout } from "./room-access-layout"

type RoomAccessPageProps = {
  inviteToken?: string
  roomId: string
}

export function RoomAccessPage({ inviteToken, roomId }: RoomAccessPageProps) {
  const router = useRouter()
  const { data: room, error, isLoading, refetch } = useRoom(roomId)
  const joinMutation = useJoinRoom()
  const attemptedInviteTokenRef = useRef<string | null>(null)
  const joinRequired = isRoomJoinRequiredError(error)

  useEffect(() => {
    const token = inviteToken?.trim()
    if (!token || !joinRequired || attemptedInviteTokenRef.current === token) {
      return
    }

    attemptedInviteTokenRef.current = token
    void (async () => {
      try {
        await joinMutation.mutateAsync({ inviteToken: token, roomId })
        toast.success(roomContentRu.join.success)
        router.replace(appRoutes.room(roomId))
      } catch (joinError) {
        await showError(joinError)
      }
    })()
  }, [inviteToken, joinMutation, joinRequired, roomId, router])

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

  if (room) {
    return <RoomDetailPage room={room} />
  }

  if (!joinRequired) {
    return (
      <RoomAccessLayout>
        <Card className="w-full border-destructive/70 bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-3xl text-destructive">
              {roomContentRu.join.loadErrorTitle}
            </CardTitle>
            <CardDescription>
              {roomContentRu.join.loadErrorDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => void refetch()}
              type="button"
              variant="secondary"
            >
              {roomContentRu.join.retry}
            </Button>
          </CardContent>
        </Card>
      </RoomAccessLayout>
    )
  }

  return (
    <RoomAccessLayout>
      <Card className="w-full border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel)]">
        <CardHeader>
          <CardTitle className="text-3xl">{roomContentRu.join.title}</CardTitle>
          <CardDescription>{roomContentRu.join.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {joinMutation.isPending ? (
            <p className="text-sm text-[var(--ml-ink-muted)]">
              {roomContentRu.join.joining}
            </p>
          ) : (
            <RoomJoinForm
              inviteToken={inviteToken}
              onJoined={() => router.replace(appRoutes.room(roomId))}
              roomId={roomId}
            />
          )}
        </CardContent>
      </Card>
    </RoomAccessLayout>
  )
}
