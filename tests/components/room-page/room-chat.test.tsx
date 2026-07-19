import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithQuery } from "@tests/helpers/render-with-query"
import { server } from "@tests/mocks/server"
import { HttpResponse, http } from "msw"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { RoomChat } from "@/components/room/chat/room-chat"

const mocks = vi.hoisted(() => ({
  getToken: vi.fn(async () => "test-token"),
  send: vi.fn(() => true),
}))

vi.mock("@clerk/nextjs", () => ({
  useAuth: () => ({
    getToken: mocks.getToken,
    isLoaded: true,
    isSignedIn: true,
    userId: "player-1",
  }),
}))

vi.mock("@/hooks/room/use-room-socket", () => ({
  useRoomSocket: () => ({ send: mocks.send, status: "connected" }),
}))

describe("RoomChat", () => {
  beforeEach(() => {
    mocks.getToken.mockClear()
    mocks.send.mockClear()
    server.use(
      http.get("http://localhost:8000/api/rooms/room-1/events", () =>
        HttpResponse.json([
          {
            actor_id: "keeper-1",
            created_at: "2026-07-19T10:00:00Z",
            id: "event-1",
            payload: { text: "Добро пожаловать" },
            room_id: "room-1",
            type: "chat.message",
          },
        ]),
      ),
    )
  })

  it("renders history and sends a chat command through the socket", async () => {
    const user = userEvent.setup()
    renderWithQuery(<RoomChat roomId="room-1" />)

    expect(await screen.findByText("Добро пожаловать")).toBeVisible()
    await user.type(screen.getByLabelText("Сообщение в чат"), "Привет всем")
    await user.click(
      screen.getByRole("button", { name: "Отправить сообщение" }),
    )

    expect(mocks.send).toHaveBeenCalledWith({
      payload: { text: "Привет всем" },
      type: "chat.message",
    })
    expect(screen.getByLabelText("Сообщение в чат")).toHaveValue("")
  })
})
