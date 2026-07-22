"use client"

import { ArrowLeft } from "lucide-react"

import { CharacterSheetHeader } from "@/components/character/detail/header/character-sheet-header"
import { CharacterSheetWorkspace } from "@/components/character/detail/layout/character-sheet-workspace"
import { roomPanelClassName } from "@/components/room/styles/room-panel.styles"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import roomContentRu from "@/data/room/room.ru.json"
import { useRoomSelectedCharacters } from "@/hooks/room/use-room-selected-characters"

type RoomCharacterSheetProps = {
  onBack?: () => void
  readOnly: boolean
  roomId: string
  userId: string
}

export function RoomCharacterSheet({
  onBack,
  readOnly,
  roomId,
  userId,
}: RoomCharacterSheetProps) {
  const { data: selectedCharacters, isLoading } =
    useRoomSelectedCharacters(roomId)
  const selectedCharacter = selectedCharacters?.find(
    (selected) => selected.user_id === userId,
  )

  if (isLoading) {
    return (
      <Card className={roomPanelClassName}>
        <CardHeader>
          <CardTitle>{roomContentRu.detail.sheetLoadingTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-[38rem] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!selectedCharacter) {
    return (
      <Card className={roomPanelClassName}>
        <CardHeader>
          <CardTitle>{roomContentRu.detail.sheetUnavailableTitle}</CardTitle>
          <CardDescription>
            {roomContentRu.detail.sheetUnavailableDescription}
          </CardDescription>
        </CardHeader>
        {onBack ? (
          <CardContent>
            <Button onClick={onBack} type="button" variant="outline">
              <ArrowLeft aria-hidden="true" data-icon="inline-start" />
              {roomContentRu.detail.sheetBack}
            </Button>
          </CardContent>
        ) : null}
      </Card>
    )
  }

  return (
    <section className="space-y-3" data-testid="room-character-sheet">
      {onBack ? (
        <Button onClick={onBack} type="button" variant="outline">
          <ArrowLeft aria-hidden="true" data-icon="inline-start" />
          {roomContentRu.detail.sheetBack}
        </Button>
      ) : null}
      <section
        aria-label={
          readOnly
            ? roomContentRu.detail.sheetReadOnlyLabel
            : selectedCharacter.character.name
        }
        className={readOnly ? "pointer-events-none select-none opacity-90" : ""}
      >
        <div className="flex min-h-[60rem] min-w-0 flex-col gap-3">
          <CharacterSheetHeader character={selectedCharacter.character} />
          <CharacterSheetWorkspace character={selectedCharacter.character} />
        </div>
      </section>
    </section>
  )
}
