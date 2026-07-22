"use client"

import { Send } from "lucide-react"
import { useMemo, useState } from "react"
import { roomPanelClassName } from "@/components/room/styles/room-panel.styles"
import { chatTextFromPayload } from "@/components/room/utils/room-chat-payload.util"
import { roomSocketStatusText } from "@/components/room/utils/room-socket-status.util"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import roomContentRu from "@/data/room/room.ru.json"
import { useRoomEvents } from "@/hooks/room/use-room-events"
import type {
  RoomSocketCommand,
  RoomSocketStatus,
} from "@/hooks/room/use-room-socket"
import { showErrorCode } from "@/lib/errors/presenter"
import type { RoomMember } from "@/types/room"

type RoomChatProps = {
  members: RoomMember[]
  roomId: string
  send: (command: RoomSocketCommand) => boolean
  status: RoomSocketStatus
}

export function RoomChat({ members, roomId, send, status }: RoomChatProps) {
  const { data: history, isLoading } = useRoomEvents(roomId)
  const [text, setText] = useState("")
  const messages = useMemo(
    () => (history ?? []).filter((event) => event.type === "chat.message"),
    [history],
  )

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const message = text.trim()
    if (!message) return
    if (!send({ payload: { text: message }, type: "chat.message" })) {
      showErrorCode("client.websocket_disconnected")
      return
    }
    setText("")
  }

  return (
    <Card className={roomPanelClassName}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-3 text-xl">
          {roomContentRu.chat.title}
          <span className="text-xs font-normal text-[var(--ml-ink-muted)]">
            {roomSocketStatusText(status)}
          </span>
        </CardTitle>
        <CardDescription>{roomContentRu.chat.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ol
          aria-busy={isLoading}
          aria-label={roomContentRu.chat.messagesAriaLabel}
          className="max-h-72 space-y-2 overflow-y-auto pr-1"
        >
          {messages.length === 0 && !isLoading ? (
            <li className="text-sm text-[var(--ml-ink-muted)]">
              {roomContentRu.chat.empty}
            </li>
          ) : null}
          {messages.map((message) => (
            <li
              className="rounded-lg border border-[var(--ml-border-subtle)] px-3 py-2"
              key={message.id}
            >
              <p className="text-xs text-[var(--ml-ink-muted)]">
                {members.find((member) => member.user_id === message.actor_id)
                  ?.username ?? message.actor_id}
              </p>
              <p className="whitespace-pre-wrap break-words">
                {chatTextFromPayload(message.payload)}
              </p>
            </li>
          ))}
        </ol>
        <form className="flex gap-2" onSubmit={submit}>
          <Input
            aria-label={roomContentRu.chat.messageLabel}
            disabled={status !== "connected"}
            maxLength={2_000}
            onChange={(event) => setText(event.target.value)}
            placeholder={roomContentRu.chat.messagePlaceholder}
            value={text}
          />
          <Button
            aria-label={roomContentRu.chat.sendAriaLabel}
            disabled={status !== "connected"}
            type="submit"
          >
            <Send aria-hidden="true" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
