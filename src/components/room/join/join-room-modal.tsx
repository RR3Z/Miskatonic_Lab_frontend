"use client"

import { useRouter } from "next/navigation"

import { RoomJoinForm } from "@/components/room/join/room-join-form"
import { Dialog } from "@/components/ui/dialog/dialog"
import { DialogContent } from "@/components/ui/dialog/dialog-content"
import { DialogDescription } from "@/components/ui/dialog/dialog-description"
import { DialogHeader } from "@/components/ui/dialog/dialog-header"
import { DialogTitle } from "@/components/ui/dialog/dialog-title"
import roomContentRu from "@/data/locales/ru/room/join.ru.json"
import { appRoutes } from "@/lib/routes/app-routes"
import type { RoomSummary } from "@/types/room.types"

import { formatRoomTemplate } from "../utils/format-room-template.util"

type JoinRoomModalProps = {
  onOpenChange: (open: boolean) => void
  open: boolean
  room: RoomSummary | null
}

export function JoinRoomModal({
  onOpenChange,
  open,
  room,
}: JoinRoomModalProps) {
  const router = useRouter()

  if (!room) return null

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="border border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel)] text-[var(--ml-ink-primary)]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {roomContentRu.join.title}
          </DialogTitle>
          <DialogDescription>
            {formatRoomTemplate(roomContentRu.join.summary, {
              maxPlayers: room.max_players,
              members: room.member_count,
              name: room.name,
            })}
          </DialogDescription>
        </DialogHeader>
        <RoomJoinForm
          onJoined={() => {
            onOpenChange(false)
            router.replace(appRoutes.room(room.id))
          }}
          roomId={room.id}
        />
      </DialogContent>
    </Dialog>
  )
}
