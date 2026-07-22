"use client"

import { Crown, UserRound, UsersRound } from "lucide-react"

import { roomOutlineButtonClassName } from "@/components/room/styles/room-button.styles"
import { roomPanelClassName } from "@/components/room/styles/room-panel.styles"
import { hasRoomCharacter } from "@/components/room/utils/has-room-character.util"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card/card"
import { CardContent } from "@/components/ui/card/card-content"
import { CardDescription } from "@/components/ui/card/card-description"
import { CardHeader } from "@/components/ui/card/card-header"
import { CardTitle } from "@/components/ui/card/card-title"
import { Select } from "@/components/ui/select/select"
import { SelectContent } from "@/components/ui/select/select-content"
import { SelectItem } from "@/components/ui/select/select-item"
import { SelectTrigger } from "@/components/ui/select/select-trigger"
import { SelectValue } from "@/components/ui/select/select-value"
import roomContentRu from "@/data/locales/ru/room/detail.ru.json"
import type { RoomMember, RoomRole } from "@/types/room.types"

type RoomMemberListProps = {
  canManageMembers: boolean
  canViewAllCharacters: boolean
  isChangingRole: boolean
  isKicking: boolean
  isTransferringOwnership: boolean
  members: RoomMember[]
  onChangeRole: (member: RoomMember, role: RoomRole) => void
  onKick: (member: RoomMember) => void
  onTransferOwnership: (member: RoomMember) => void
  onViewCharacter: (member: RoomMember) => void
  ownerId: string
  userId: string | null | undefined
}

export function RoomMemberList({
  canManageMembers,
  canViewAllCharacters,
  isChangingRole,
  isKicking,
  isTransferringOwnership,
  members,
  onChangeRole,
  onKick,
  onTransferOwnership,
  onViewCharacter,
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
            const role =
              member.role === "gm"
                ? roomContentRu.detail.gameMaster
                : roomContentRu.detail.player
            const characterStatus = hasRoomCharacter(member)
              ? roomContentRu.detail.characterSelected
              : roomContentRu.detail.noCharacter
            const description = isOwner
              ? `${roomContentRu.detail.keeper} ${roomContentRu.detail.separator} ${role} ${roomContentRu.detail.separator} ${characterStatus}`
              : `${role} ${roomContentRu.detail.separator} ${characterStatus}`

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
                    {isCurrentUser
                      ? roomContentRu.detail.you
                      : (member.username ?? member.user_id)}
                  </p>
                  <p className="text-xs text-[var(--ml-ink-muted)]">
                    {description}
                  </p>
                </div>
                {canManageMembers ? (
                  <div className="flex shrink-0 flex-wrap justify-end gap-2">
                    <Select
                      disabled={isChangingRole}
                      onValueChange={(value) =>
                        onChangeRole(member, value as RoomRole)
                      }
                      value={member.role}
                    >
                      <SelectTrigger
                        aria-label={roomContentRu.detail.roleSelectAriaLabel}
                        className="w-32"
                        size="sm"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gm">
                          {roomContentRu.detail.gameMaster}
                        </SelectItem>
                        <SelectItem value="player">
                          {roomContentRu.detail.player}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {!isOwner ? (
                      <>
                        <Button
                          className={roomOutlineButtonClassName}
                          disabled={isTransferringOwnership}
                          onClick={() => onTransferOwnership(member)}
                          size="sm"
                          type="button"
                          variant="outline"
                        >
                          {roomContentRu.detail.transferOwnership}
                        </Button>
                        <Button
                          className={roomOutlineButtonClassName}
                          disabled={isKicking}
                          onClick={() => onKick(member)}
                          size="sm"
                          type="button"
                          variant="outline"
                        >
                          {roomContentRu.detail.kick}
                        </Button>
                      </>
                    ) : null}
                  </div>
                ) : null}
                {canViewAllCharacters && hasRoomCharacter(member) ? (
                  <Button
                    className="shrink-0"
                    onClick={() => onViewCharacter(member)}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    {roomContentRu.detail.viewCharacter}
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
