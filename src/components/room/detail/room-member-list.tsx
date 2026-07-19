"use client"

import { Crown, UserRound, UsersRound } from "lucide-react"
import { roomPanelClassName } from "@/components/room/styles/room-panel.styles"
import { hasRoomCharacter } from "@/components/room/utils/has-room-character.util"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import roomContentRu from "@/data/room/room.ru.json"
import type { RoomMember } from "@/types/room"

type RoomMemberListProps = {
  canKick: boolean
  isKicking: boolean
  members: RoomMember[]
  onKick: (member: RoomMember) => void
  ownerId: string
  userId: string | null | undefined
}

export function RoomMemberList({
  canKick,
  isKicking,
  members,
  onKick,
  ownerId,
  userId,
}: RoomMemberListProps) {
  return (
    <Card className={roomPanelClassName}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <UsersRound aria-hidden="true" />
          {roomContentRu.detail.membersTitle}
        </CardTitle>
        <CardDescription>
          {roomContentRu.detail.membersDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {members.map((member) => {
            const isOwner = member.user_id === ownerId
            const isCurrentUser = member.user_id === userId
            const role = isOwner
              ? roomContentRu.detail.keeper
              : roomContentRu.detail.player
            const characterStatus = hasRoomCharacter(member)
              ? roomContentRu.detail.characterSelected
              : roomContentRu.detail.noCharacter

            return (
              <li
                className="flex items-center justify-between gap-3 rounded-lg border border-[var(--ml-border-subtle)] px-3 py-2"
                key={member.id}
              >
                <div className="min-w-0">
                  <p className="flex items-center gap-2 truncate font-medium">
                    {isOwner ? (
                      <Crown
                        aria-label={roomContentRu.detail.keeper}
                        className="size-4 shrink-0"
                      />
                    ) : (
                      <UserRound
                        aria-hidden="true"
                        className="size-4 shrink-0"
                      />
                    )}
                    {isCurrentUser ? roomContentRu.detail.you : member.user_id}
                  </p>
                  <p className="text-xs text-[var(--ml-ink-muted)]">
                    {role} — {characterStatus}
                  </p>
                </div>
                {canKick && !isOwner ? (
                  <Button
                    disabled={isKicking}
                    onClick={() => onKick(member)}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    {roomContentRu.detail.kick}
                  </Button>
                ) : null}
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
