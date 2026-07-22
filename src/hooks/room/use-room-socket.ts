"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { useRoomSession } from "@/hooks/room/use-room-session"
import type { RoomSocketEvent } from "@/types/room.types"

import { parseRoomSocketEvent } from "./utils/room-socket-payload.util"

export type RoomSocketStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "unsupported"

export type RoomSocketCommand = {
  type: string
  payload?: unknown
}

type UseRoomSocketOptions = {
  enabled: boolean
  onEvent: (event: RoomSocketEvent) => void
  onTerminalClose?: () => void
  roomId: string
}

const reconnectDelayMilliseconds = 2_000

export function useRoomSocket({
  enabled,
  onEvent,
  onTerminalClose,
  roomId,
}: UseRoomSocketOptions) {
  const { getToken } = useRoomSession()
  const [status, setStatus] = useState<RoomSocketStatus>("disconnected")
  const socketRef = useRef<WebSocket | null>(null)
  const onEventRef = useRef(onEvent)
  const onTerminalCloseRef = useRef(onTerminalClose)

  useEffect(() => {
    onEventRef.current = onEvent
  }, [onEvent])

  useEffect(() => {
    onTerminalCloseRef.current = onTerminalClose
  }, [onTerminalClose])

  useEffect(() => {
    if (!enabled || !roomId) {
      setStatus("disconnected")
      return
    }
    if (typeof WebSocket === "undefined") {
      setStatus("unsupported")
      return
    }

    let disposed = false
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined

    async function connect() {
      setStatus("connecting")
      const token = await getToken()
      if (disposed || !token) {
        if (!disposed) setStatus("disconnected")
        return
      }

      const socket = new WebSocket(roomWebSocketURL(roomId), ["bearer", token])
      socketRef.current = socket
      socket.onopen = () => {
        if (!disposed) setStatus("connected")
      }
      socket.onmessage = (message) => {
        const event = parseRoomSocketEvent(message.data)
        if (event && event.room_id === roomId) onEventRef.current(event)
      }
      socket.onclose = (event) => {
        if (socketRef.current === socket) socketRef.current = null
        if (disposed) return
        setStatus("disconnected")
        if (isTerminalRoomSocketClose(event.code, event.reason)) {
          onTerminalCloseRef.current?.()
          return
        }
        reconnectTimer = setTimeout(
          () => void connect(),
          reconnectDelayMilliseconds,
        )
      }
      socket.onerror = () => socket.close()
    }

    void connect()
    return () => {
      disposed = true
      if (reconnectTimer) clearTimeout(reconnectTimer)
      socketRef.current?.close()
      socketRef.current = null
    }
  }, [enabled, getToken, roomId])

  const send = useCallback((command: RoomSocketCommand) => {
    const socket = socketRef.current
    if (!socket || socket.readyState !== WebSocket.OPEN) return false
    socket.send(JSON.stringify(command))
    return true
  }, [])

  return { send, status }
}

const terminalCloseReasons = [
  "room deleted",
  "room deleted after disconnect",
  "room deleted by cleanup",
  "room left",
  "removed from room",
  "room membership is closing",
]

export function isTerminalRoomSocketClose(code: number, reason: string) {
  return (
    code === 1008 ||
    terminalCloseReasons.some((terminalReason) =>
      reason.startsWith(terminalReason),
    )
  )
}

export function roomWebSocketURL(roomId: string) {
  const apiBaseURL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"
  const url = new URL(apiBaseURL)
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:"
  url.pathname = `${url.pathname.replace(/\/$/, "")}/api/rooms/${encodeURIComponent(roomId)}/ws`
  url.search = ""
  return url.toString()
}
