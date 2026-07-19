"use client"

import { Settings2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { roomPanelClassName } from "@/components/room/styles/room-panel.styles"
import { presentRoomError } from "@/components/room/utils/room-error-presenter.util"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import roomContentRu from "@/data/room/room.ru.json"
import { useUpdateRoom } from "@/hooks/room/use-update-room"
import type { Room } from "@/types/room"

type RoomSettingsProps = {
  room: Room
}

export function RoomSettings({ room }: RoomSettingsProps) {
  const mutation = useUpdateRoom()
  const [name, setName] = useState(room.name)
  const [maxPlayers, setMaxPlayers] = useState(String(room.max_players))
  const [password, setPassword] = useState("")

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsedMaxPlayers = Number.parseInt(maxPlayers, 10)
    if (
      !name.trim() ||
      !Number.isInteger(parsedMaxPlayers) ||
      parsedMaxPlayers < 1
    ) {
      toast.error(roomContentRu.detail.validationError)
      return
    }

    try {
      await mutation.mutateAsync({
        maxPlayers: parsedMaxPlayers,
        name,
        password: password || undefined,
        roomId: room.id,
      })
      setPassword("")
      toast.success(roomContentRu.detail.settingsSuccess)
    } catch (error) {
      toast.error(presentRoomError(error))
    }
  }

  return (
    <Card className={`h-fit ${roomPanelClassName}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Settings2 aria-hidden="true" />
          {roomContentRu.detail.settingsTitle}
        </CardTitle>
        <CardDescription>
          {roomContentRu.detail.settingsDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={(event) => void save(event)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="room-settings-name">
                {roomContentRu.detail.nameLabel}
              </FieldLabel>
              <Input
                id="room-settings-name"
                maxLength={120}
                onChange={(event) => setName(event.target.value)}
                value={name}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="room-settings-max-players">
                {roomContentRu.detail.maxPlayersLabel}
              </FieldLabel>
              <Input
                id="room-settings-max-players"
                min={1}
                onChange={(event) => setMaxPlayers(event.target.value)}
                type="number"
                value={maxPlayers}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="room-settings-password">
                {roomContentRu.detail.newPasswordLabel}
              </FieldLabel>
              <Input
                autoComplete="new-password"
                id="room-settings-password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder={roomContentRu.detail.newPasswordPlaceholder}
                type="password"
                value={password}
              />
            </Field>
          </FieldGroup>
          <Button
            className="mt-5 w-full"
            disabled={mutation.isPending}
            type="submit"
            variant="success"
          >
            {roomContentRu.detail.save}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
