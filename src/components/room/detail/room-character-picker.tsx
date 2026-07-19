"use client"

import { toast } from "sonner"
import { roomPanelClassName } from "@/components/room/styles/room-panel.styles"
import { hasRoomCharacter } from "@/components/room/utils/has-room-character.util"
import { presentRoomError } from "@/components/room/utils/room-error-presenter.util"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import roomContentRu from "@/data/room/room.ru.json"
import { useSelectRoomCharacter } from "@/hooks/room/use-select-room-character"
import { useCharacters } from "@/lib/api/use-characters"
import type { RoomMember } from "@/types/room"

type RoomCharacterPickerProps = {
  members: RoomMember[]
  roomId: string
  userId: string | null | undefined
}

export function RoomCharacterPicker({
  members,
  roomId,
  userId,
}: RoomCharacterPickerProps) {
  const { data: characters, isLoading } = useCharacters()
  const mutation = useSelectRoomCharacter()
  const currentMember = members.find((member) => member.user_id === userId)
  const selectedCharacter = hasRoomCharacter(currentMember)
    ? (currentMember?.character_id ?? "")
    : ""

  async function selectCharacter(characterId: string) {
    if (!characterId) return
    try {
      await mutation.mutateAsync({ characterId, roomId })
      toast.success(roomContentRu.detail.characterSuccess)
    } catch (error) {
      toast.error(presentRoomError(error))
    }
  }

  return (
    <Card className={roomPanelClassName}>
      <CardHeader>
        <CardTitle className="text-xl">
          {roomContentRu.detail.characterTitle}
        </CardTitle>
        <CardDescription>
          {roomContentRu.detail.characterDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select
            disabled={mutation.isPending || !currentMember}
            onValueChange={(value) => void selectCharacter(value)}
            value={selectedCharacter}
          >
            <SelectTrigger
              aria-label={roomContentRu.detail.characterLabel}
              className="w-full"
            >
              <SelectValue
                placeholder={roomContentRu.detail.characterPlaceholder}
              />
            </SelectTrigger>
            <SelectContent>
              {(characters ?? []).map((character) => (
                <SelectItem key={character.id} value={character.id}>
                  {character.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardContent>
    </Card>
  )
}
