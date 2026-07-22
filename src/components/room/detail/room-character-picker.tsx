"use client"

import { toast } from "sonner"
import { showError } from "@/components/errors/utils/error-toast.util"
import { roomPanelClassName } from "@/components/room/styles/room-panel.styles"
import { hasRoomCharacter } from "@/components/room/utils/has-room-character.util"
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
import { Skeleton } from "@/components/ui/skeleton"
import roomContentRu from "@/data/locales/ru/room/detail.ru.json"
import { useCharacters } from "@/hooks/character/use-characters"
import { useSelectRoomCharacter } from "@/hooks/room/use-select-room-character"
import type { RoomMember } from "@/types/room.types"

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
      await showError(error)
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
