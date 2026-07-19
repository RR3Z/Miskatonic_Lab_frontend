"use client"

import { Plus } from "lucide-react"
import { useState } from "react"
import { RoomCatalogContent } from "@/components/room/catalog/room-catalog-content"
import { CreateRoomModal } from "@/components/room/create/create-room-modal"
import { JoinRoomModal } from "@/components/room/join/join-room-modal"
import { roomOutlineButtonClassName } from "@/components/room/styles/room-button.styles"
import { Button } from "@/components/ui/button"
import roomContentRu from "@/data/room/room.ru.json"
import { useRooms } from "@/hooks/room/use-rooms"
import type { RoomSummary } from "@/types/room"

export function RoomCatalogPage() {
  const { data, error, isFetching, isLoading, refetch } = useRooms()
  const [createOpen, setCreateOpen] = useState(false)
  const [joinRoom, setJoinRoom] = useState<RoomSummary | null>(null)
  const rooms = data ?? []

  return (
    <div className="mx-auto w-full max-w-[1720px] px-4 py-6 sm:px-8 sm:py-8 lg:py-10">
      <div className="mb-5 flex items-start justify-between gap-4 sm:mb-6 sm:items-center">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-wide text-[var(--ml-ink-primary)] sm:text-3xl lg:text-4xl">
            {roomContentRu.catalog.title}
          </h1>
          <p className="mt-1 text-sm text-[var(--ml-ink-muted)]">
            {roomContentRu.catalog.description}
          </p>
        </div>
        <Button
          aria-label={roomContentRu.catalog.createAriaLabel}
          className={roomOutlineButtonClassName}
          onClick={() => setCreateOpen(true)}
          size="icon"
          type="button"
          variant="outline"
        >
          <Plus aria-hidden="true" />
        </Button>
      </div>
      <RoomCatalogContent
        hasLoadError={Boolean(error) && data === undefined}
        isFetching={isFetching}
        isLoading={isLoading}
        onCreate={() => setCreateOpen(true)}
        onJoin={setJoinRoom}
        onRetry={() => void refetch()}
        rooms={rooms}
      />
      <CreateRoomModal open={createOpen} onOpenChange={setCreateOpen} />
      <JoinRoomModal
        onOpenChange={(open) => !open && setJoinRoom(null)}
        open={joinRoom !== null}
        room={joinRoom}
      />
    </div>
  )
}
