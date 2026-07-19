"use client"

import { Check, Copy, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import roomContentRu from "@/data/room/room.ru.json"
import { useCreateRoom } from "@/hooks/room/use-create-room"
import type { Room } from "@/types/room"
import { presentRoomError } from "../utils/room-error-presenter.util"
import { roomInviteLink } from "./utils/room-invite-link.util"

type CreateRoomModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const defaultMaxPlayers = 7

export function CreateRoomModal({ open, onOpenChange }: CreateRoomModalProps) {
  const mutation = useCreateRoom()
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [maxPlayers, setMaxPlayers] = useState(String(defaultMaxPlayers))
  const [createdRoom, setCreatedRoom] = useState<Room | null>(null)
  const isPending = mutation.isPending

  function closeModal() {
    if (isPending) return
    setCreatedRoom(null)
    onOpenChange(false)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsedMaxPlayers = Number.parseInt(maxPlayers, 10)
    if (
      !password.trim() ||
      !Number.isInteger(parsedMaxPlayers) ||
      parsedMaxPlayers < 1
    ) {
      toast.error(roomContentRu.create.validationError, {
        id: "room-create-validation-error",
      })
      return
    }

    try {
      const room = await mutation.mutateAsync({
        name,
        maxPlayers: parsedMaxPlayers,
        password,
      })
      setCreatedRoom(room)
      setPassword("")
    } catch (error) {
      toast.error(presentRoomError(error), { id: "room-create-error" })
    }
  }

  async function copyInviteLink() {
    if (
      !createdRoom ||
      typeof navigator === "undefined" ||
      !navigator.clipboard
    ) {
      toast.error(roomContentRu.create.copyError)
      return
    }

    try {
      await navigator.clipboard.writeText(roomInviteLink(createdRoom))
      toast.success(roomContentRu.create.copySuccess)
    } catch {
      toast.error(roomContentRu.create.copyError)
    }
  }

  return (
    <Dialog
      onOpenChange={(nextOpen) => {
        if (!isPending) onOpenChange(nextOpen)
      }}
      open={open}
    >
      <DialogContent
        className="border border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel)] text-[var(--ml-ink-primary)] sm:max-w-[34rem]"
        showCloseButton={false}
      >
        <DialogHeader className="pr-9">
          <DialogTitle className="text-2xl">
            {createdRoom
              ? roomContentRu.create.createdTitle
              : roomContentRu.create.title}
          </DialogTitle>
          <DialogDescription>
            {createdRoom
              ? roomContentRu.create.createdDescription
              : roomContentRu.create.description}
          </DialogDescription>
        </DialogHeader>
        <DialogClose asChild>
          <Button
            aria-label={roomContentRu.create.closeAriaLabel}
            className="absolute top-2 right-2"
            disabled={isPending}
            onClick={closeModal}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <X aria-hidden="true" />
          </Button>
        </DialogClose>

        {createdRoom ? (
          <div className="space-y-4">
            <p className="font-heading text-lg">{createdRoom.name}</p>
            <Input
              aria-label={roomContentRu.create.inviteLinkLabel}
              readOnly
              value={roomInviteLink(createdRoom)}
            />
            <DialogFooter className="sm:justify-stretch">
              <Button
                className="w-full sm:flex-1"
                onClick={() => void copyInviteLink()}
                type="button"
                variant="success"
              >
                <Copy aria-hidden="true" data-icon="inline-start" />
                {roomContentRu.create.copy}
              </Button>
              <Button
                className="w-full sm:flex-1"
                onClick={closeModal}
                type="button"
                variant="secondary"
              >
                <Check aria-hidden="true" data-icon="inline-start" />
                {roomContentRu.create.done}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form noValidate onSubmit={(event) => void handleSubmit(event)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="room-name">
                  {roomContentRu.create.nameLabel}
                </FieldLabel>
                <Input
                  disabled={isPending}
                  id="room-name"
                  maxLength={120}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={roomContentRu.create.namePlaceholder}
                  value={name}
                />
                <FieldDescription>
                  {roomContentRu.create.nameDescription}
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="room-password">
                  {roomContentRu.create.passwordLabel}
                </FieldLabel>
                <Input
                  autoComplete="new-password"
                  disabled={isPending}
                  id="room-password"
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  type="password"
                  value={password}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="room-max-players">
                  {roomContentRu.create.maxPlayersLabel}
                </FieldLabel>
                <Input
                  disabled={isPending}
                  id="room-max-players"
                  min={1}
                  onChange={(event) => setMaxPlayers(event.target.value)}
                  required
                  type="number"
                  value={maxPlayers}
                />
              </Field>
            </FieldGroup>
            <DialogFooter className="mt-5 sm:justify-stretch">
              <Button
                className="w-full sm:flex-1"
                disabled={isPending}
                onClick={closeModal}
                type="button"
                variant="destructive"
              >
                {roomContentRu.create.cancel}
              </Button>
              <Button
                className="w-full sm:flex-1"
                disabled={isPending}
                type="submit"
                variant="success"
              >
                {isPending ? (
                  <Spinner aria-hidden="true" data-icon="inline-start" />
                ) : null}
                {isPending
                  ? roomContentRu.create.creating
                  : roomContentRu.create.submit}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
