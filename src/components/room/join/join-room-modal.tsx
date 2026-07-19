"use client"

import { RoomJoinForm } from "@/components/room/join/room-join-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import roomContentRu from "@/data/room/room.ru.json"
import type { RoomSummary } from "@/types/room"

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
        <RoomJoinForm onJoined={() => onOpenChange(false)} roomId={room.id} />
      </DialogContent>
    </Dialog>
  )
}
