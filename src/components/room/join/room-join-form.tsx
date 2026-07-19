"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import roomContentRu from "@/data/room/room.ru.json"
import { useJoinRoom } from "@/hooks/room/use-join-room"

import { showError, showErrorCode } from "@/lib/errors/presenter"

type RoomJoinFormProps = {
  inviteToken?: string
  onJoined: () => void
  roomId: string
}

export function RoomJoinForm({
  inviteToken,
  onJoined,
  roomId,
}: RoomJoinFormProps) {
  const mutation = useJoinRoom()
  const [password, setPassword] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!inviteToken?.trim() && !password.trim()) {
      showErrorCode("client.validation_failed")
      return
    }

    try {
      await mutation.mutateAsync({ inviteToken, password, roomId })
      toast.success(roomContentRu.join.success)
      onJoined()
    } catch (error) {
      await showError(error)
    }
  }

  return (
    <form noValidate onSubmit={(event) => void handleSubmit(event)}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={`room-password-${roomId}`}>
            {roomContentRu.join.passwordLabel}
          </FieldLabel>
          <Input
            autoComplete="current-password"
            disabled={mutation.isPending}
            id={`room-password-${roomId}`}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={
              inviteToken ? roomContentRu.join.passwordPlaceholder : undefined
            }
            type="password"
            value={password}
          />
          <FieldDescription>
            {inviteToken
              ? roomContentRu.join.inviteDescription
              : roomContentRu.join.passwordDescription}
          </FieldDescription>
        </Field>
      </FieldGroup>
      <Button
        className="mt-5 w-full"
        disabled={mutation.isPending}
        type="submit"
        variant="success"
      >
        {mutation.isPending ? (
          <Spinner aria-hidden="true" data-icon="inline-start" />
        ) : null}
        {mutation.isPending
          ? roomContentRu.join.joining
          : roomContentRu.join.submit}
      </Button>
    </form>
  )
}
