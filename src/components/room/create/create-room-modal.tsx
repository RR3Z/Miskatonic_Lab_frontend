"use client"

import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

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
import { showError, showErrorCode } from "@/lib/errors/presenter"
import { appRoutes } from "@/lib/routes/app-routes"

type CreateRoomModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const defaultMaxPlayers = 7

export function CreateRoomModal({ open, onOpenChange }: CreateRoomModalProps) {
  const router = useRouter()
  const mutation = useCreateRoom()
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [maxPlayers, setMaxPlayers] = useState(String(defaultMaxPlayers))
  const isPending = mutation.isPending

  function closeModal() {
    if (isPending) return
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
      showErrorCode("client.validation_failed", "room-create-validation-error")
      return
    }

    try {
      const room = await mutation.mutateAsync({
        name,
        maxPlayers: parsedMaxPlayers,
        password,
      })
      onOpenChange(false)
      router.replace(appRoutes.room(room.id))
    } catch (error) {
      await showError(error, "room-create-error")
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
            {roomContentRu.create.title}
          </DialogTitle>
          <DialogDescription>
            {roomContentRu.create.description}
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
      </DialogContent>
    </Dialog>
  )
}
