import { act, screen, waitFor } from "@testing-library/react"
import { renderWithQuery } from "@tests/helpers/render-with-query"
import { server } from "@tests/mocks/server"
import { HttpResponse, http } from "msw"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { RoomAccessPage } from "@/components/room/join/room-access-page"

const mocks = vi.hoisted(() => ({
  getToken: vi.fn(async () => "test-token"),
  replace: vi.fn(),
  socketOptions: undefined as unknown,
}))

vi.mock("@clerk/nextjs", () => ({
  useAuth: () => ({
    getToken: mocks.getToken,
    isLoaded: true,
    isSignedIn: true,
    userId: "player-1",
  }),
}))

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mocks.replace }),
}))

vi.mock("@/hooks/room/use-room-socket", () => ({
  useRoomSocket: (options: unknown) => {
    mocks.socketOptions = options
    return { send: vi.fn(() => false), status: "connected" }
  },
}))

describe("RoomAccessPage", () => {
  beforeEach(() => {
    server.use(
      http.get("http://localhost:8000/api/rooms/room-1/characters", () =>
        HttpResponse.json([]),
      ),
      http.get("http://localhost:8000/api/rooms/room-1/events", () =>
        HttpResponse.json([]),
      ),
    )
  })

  it("shows retryable error instead of password form after a server error", async () => {
    server.use(
      http.get("http://localhost:8000/api/rooms/room-1/", () =>
        HttpResponse.json({ code: "common.internal_error" }, { status: 500 }),
      ),
    )
    renderWithQuery(<RoomAccessPage roomId="room-1" />)

    expect(
      await screen.findByText(
        "Не удалось открыть комнату",
        {},
        { timeout: 3_000 },
      ),
    ).toBeVisible()
    expect(screen.getByRole("button", { name: "Повторить" })).toBeVisible()
    expect(screen.queryByLabelText("Пароль")).not.toBeInTheDocument()
  })

  it("shows join form only after 404", async () => {
    server.use(
      http.get("http://localhost:8000/api/rooms/room-1/", () =>
        HttpResponse.json({ code: "room.not_found" }, { status: 404 }),
      ),
    )
    renderWithQuery(<RoomAccessPage roomId="room-1" />)

    expect(
      await screen.findByLabelText("Пароль", {}, { timeout: 3_000 }),
    ).toBeVisible()
  })

  it("joins and opens the room automatically from an invite link", async () => {
    let joined = false
    server.use(
      http.get("http://localhost:8000/api/rooms/room-1/", () => {
        if (!joined) {
          return HttpResponse.json({ code: "room.not_found" }, { status: 404 })
        }

        return HttpResponse.json({
          created_at: "2026-07-19T10:00:00Z",
          id: "room-1",
          last_activity_at: "2026-07-19T10:00:00Z",
          max_players: 4,
          members: [
            {
              character_id: "00000000-0000-0000-0000-000000000000",
              id: "member-1",
              joined_at: "2026-07-19T10:00:00Z",
              role: "player",
              room_id: "room-1",
              user_id: "player-1",
              username: "Первый",
            },
          ],
          name: "Тестовая комната",
          owner_id: "owner-1",
          updated_at: "2026-07-19T10:00:00Z",
        })
      }),
      http.post(
        "http://localhost:8000/api/rooms/room-1/join",
        async ({ request }) => {
          await expect(request.json()).resolves.toEqual({
            invite_token: "invite-token",
          })
          joined = true
          return HttpResponse.json({
            character_id: "00000000-0000-0000-0000-000000000000",
            id: "member-1",
            joined_at: "2026-07-19T10:00:00Z",
            role: "player",
            room_id: "room-1",
            user_id: "player-1",
          })
        },
      ),
    )
    renderWithQuery(
      <RoomAccessPage inviteToken="invite-token" roomId="room-1" />,
    )

    await waitFor(() =>
      expect(mocks.replace).toHaveBeenCalledWith("/rooms/room-1"),
    )
  })

  it("refetches active room data after a room websocket event", async () => {
    let requestCount = 0
    server.use(
      http.get("http://localhost:8000/api/rooms/room-1/characters", () =>
        HttpResponse.json([]),
      ),
      http.get("http://localhost:8000/api/rooms/room-1/events", () =>
        HttpResponse.json([]),
      ),
      http.get("http://localhost:8000/api/rooms/room-1/", () => {
        requestCount += 1
        return HttpResponse.json({
          created_at: "2026-07-19T10:00:00Z",
          id: "room-1",
          last_activity_at: "2026-07-19T10:00:00Z",
          max_players: 4,
          members:
            requestCount === 1
              ? [
                  {
                    character_id: "00000000-0000-0000-0000-000000000000",
                    id: "member-1",
                    joined_at: "2026-07-19T10:00:00Z",
                    role: "player",
                    room_id: "room-1",
                    user_id: "player-1",
                    username: "Первый",
                  },
                ]
              : [
                  {
                    character_id: "00000000-0000-0000-0000-000000000000",
                    id: "member-1",
                    joined_at: "2026-07-19T10:00:00Z",
                    role: "player",
                    room_id: "room-1",
                    user_id: "player-1",
                    username: "Первый",
                  },
                  {
                    character_id: "00000000-0000-0000-0000-000000000000",
                    id: "member-2",
                    joined_at: "2026-07-19T10:01:00Z",
                    role: "player",
                    room_id: "room-1",
                    user_id: "player-2",
                    username: "Второй",
                  },
                ],
          name: "Тестовая комната",
          owner_id: "player-1",
          updated_at: "2026-07-19T10:00:00Z",
        })
      }),
    )
    renderWithQuery(<RoomAccessPage roomId="room-1" />)
    await screen.findByText("1 / 4 игроков")

    const options = mocks.socketOptions as {
      onEvent: (event: {
        actor_id: string
        room_id: string
        type: string
      }) => void
    }
    await act(async () => {
      options.onEvent({
        actor_id: "player-2",
        room_id: "room-1",
        type: "member.joined",
      })
    })

    expect(await screen.findByText("2 / 4 игроков")).toBeVisible()
    expect(screen.getByText("Второй")).toBeVisible()
  })
})
