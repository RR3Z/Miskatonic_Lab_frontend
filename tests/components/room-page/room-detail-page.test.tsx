import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithQuery } from "@tests/helpers/render-with-query"
import { server } from "@tests/mocks/server"
import { HttpResponse, http } from "msw"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { RoomDetailPage } from "@/components/room/detail/room-detail-page"
import roomContentRu from "@/data/locales/ru/room/detail.ru.json"
import type { Room } from "@/types/room.types"

const mocks = vi.hoisted(() => ({
  getToken: vi.fn(async () => "test-token"),
  replace: vi.fn(),
  socketOptions: undefined as unknown,
  toastError: vi.fn(),
  toastSuccess: vi.fn(),
  useRoomSocket: vi.fn(),
}))

vi.mock("@clerk/nextjs", () => ({
  useAuth: () => ({
    getToken: mocks.getToken,
    isLoaded: true,
    isSignedIn: true,
    userId: "owner-1",
  }),
}))

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mocks.replace }),
}))

vi.mock("@/hooks/room/use-room-socket", () => ({
  useRoomSocket: (options: unknown) => {
    mocks.socketOptions = options
    mocks.useRoomSocket()
    return {
      send: vi.fn(() => false),
      status: "unsupported",
    }
  },
}))

vi.mock("sonner", () => ({
  toast: {
    error: mocks.toastError,
    success: mocks.toastSuccess,
  },
}))

const room: Room = {
  created_at: "2026-07-19T10:00:00Z",
  id: "room-1",
  invite_token: "invite-token",
  last_activity_at: "2026-07-19T10:00:00Z",
  max_players: 4,
  members: [
    {
      character_id: "00000000-0000-0000-0000-000000000000",
      id: "member-owner",
      joined_at: "2026-07-19T10:00:00Z",
      role: "player",
      room_id: "room-1",
      user_id: "owner-1",
    },
    {
      character_id: "00000000-0000-0000-0000-000000000000",
      id: "member-player",
      joined_at: "2026-07-19T10:01:00Z",
      role: "player",
      room_id: "room-1",
      user_id: "player-2",
    },
  ],
  name: "Зов Ктулху",
  owner_id: "owner-1",
  updated_at: "2026-07-19T10:00:00Z",
}

function charactersHandler() {
  return http.get("http://localhost:8000/api/characters/", () =>
    HttpResponse.json([
      {
        age: null,
        created_at: "2026-07-19T10:00:00Z",
        hp: null,
        id: "character-1",
        luck: null,
        mp: null,
        name: "Роланд",
        occupation: null,
        portrait_url: null,
        residence: null,
        sanity: null,
        sex: null,
        updated_at: "2026-07-19T10:00:00Z",
      },
    ]),
  )
}

function roomEventsHandler() {
  return http.get("http://localhost:8000/api/rooms/room-1/events", () =>
    HttpResponse.json([]),
  )
}

describe("RoomDetailPage", () => {
  beforeEach(() => {
    mocks.getToken.mockClear()
    mocks.replace.mockClear()
    mocks.socketOptions = undefined
    mocks.toastError.mockClear()
    mocks.toastSuccess.mockClear()
    mocks.useRoomSocket.mockClear()
    server.use(charactersHandler(), roomEventsHandler())
  })

  it("shows the owner invite link in room settings", async () => {
    renderWithQuery(<RoomDetailPage room={room} />)

    const inviteLink = await screen.findByLabelText(
      roomContentRu.detail.inviteLinkLabel,
    )
    expect(inviteLink).toHaveValue(
      `${window.location.origin}/rooms/room-1?invite=invite-token`,
    )
    expect(
      screen.getByRole("button", { name: roomContentRu.detail.inviteCopy }),
    ).toBeVisible()
  })

  it("lets a member select a character", async () => {
    const user = userEvent.setup()
    server.use(
      charactersHandler(),
      http.put(
        "http://localhost:8000/api/rooms/room-1/character",
        async ({ request }) => {
          await expect(request.json()).resolves.toEqual({
            character_id: "character-1",
          })
          return HttpResponse.json({})
        },
      ),
    )
    renderWithQuery(<RoomDetailPage room={room} />)

    await user.click(await screen.findByLabelText("Персонаж для комнаты"))
    await user.click(screen.getByRole("option", { name: "Роланд" }))

    await waitFor(() =>
      expect(mocks.toastSuccess).toHaveBeenCalledWith(
        "Персонаж выбран для комнаты.",
      ),
    )
  })

  it("lets the keeper save room settings", async () => {
    const user = userEvent.setup()
    server.use(
      charactersHandler(),
      http.put(
        "http://localhost:8000/api/rooms/room-1/",
        async ({ request }) => {
          await expect(request.json()).resolves.toEqual({
            max_players: 5,
            name: "Новый зов",
          })
          return HttpResponse.json(room)
        },
      ),
    )
    renderWithQuery(<RoomDetailPage room={room} />)

    await user.clear(screen.getByLabelText("Название"))
    await user.type(screen.getByLabelText("Название"), "Новый зов")
    await user.clear(screen.getByLabelText("Лимит игроков"))
    await user.type(screen.getByLabelText("Лимит игроков"), "5")
    await user.click(screen.getByRole("button", { name: "Сохранить" }))

    await waitFor(() =>
      expect(mocks.toastSuccess).toHaveBeenCalledWith(
        "Настройки комнаты сохранены.",
      ),
    )
  })

  it("lets the keeper make themselves a GM or player", async () => {
    const user = userEvent.setup()
    server.use(
      http.put(
        "http://localhost:8000/api/rooms/room-1/members/owner-1/role",
        async ({ request }) => {
          await expect(request.json()).resolves.toEqual({ role: "gm" })
          return HttpResponse.json({ ...room.members?.[0], role: "gm" })
        },
      ),
    )
    renderWithQuery(<RoomDetailPage room={room} />)

    await user.click(
      (await screen.findAllByLabelText("Изменить роль участника"))[0],
    )
    await user.click(screen.getByRole("option", { name: "GM" }))

    await waitFor(() =>
      expect(mocks.toastSuccess).toHaveBeenCalledWith(
        "Роль участника изменена.",
      ),
    )
  })

  it("transfers ownership without changing the target role", async () => {
    const user = userEvent.setup()
    server.use(
      http.put(
        "http://localhost:8000/api/rooms/room-1/owner",
        async ({ request }) => {
          await expect(request.json()).resolves.toEqual({ user_id: "player-2" })
          return HttpResponse.json({ ...room, owner_id: "player-2" })
        },
      ),
    )
    renderWithQuery(<RoomDetailPage room={room} />)

    await user.click(
      await screen.findByRole("button", { name: "Передать владение" }),
    )

    await waitFor(() =>
      expect(mocks.toastSuccess).toHaveBeenCalledWith(
        "Владение комнатой передано.",
      ),
    )
  })

  it("redirects a kicked user after the member.kicked event", async () => {
    renderWithQuery(<RoomDetailPage room={room} />)

    const options = mocks.socketOptions as {
      onEvent: (event: {
        actor_id: string
        payload: unknown
        room_id: string
        type: string
      }) => void
    }
    options.onEvent({
      actor_id: "owner-1",
      payload: { user_id: "owner-1" },
      room_id: "room-1",
      type: "member.kicked",
    })

    await waitFor(() => {
      expect(mocks.toastError).toHaveBeenCalledWith("Вас исключили из комнаты.")
      expect(mocks.replace).toHaveBeenCalledWith("/rooms")
    })
  })

  it("shows sender-only websocket command errors without refetching the room", async () => {
    renderWithQuery(<RoomDetailPage room={room} />)

    const options = mocks.socketOptions as {
      onEvent: (event: {
        actor_id: string
        payload: unknown
        room_id: string
        type: string
      }) => void
    }
    options.onEvent({
      actor_id: "owner-1",
      payload: { code: "common.invalid_request" },
      room_id: "room-1",
      type: "command.error",
    })

    await waitFor(() =>
      expect(mocks.toastError).toHaveBeenCalledWith(
        "common.invalid_request — Некорректный запрос",
        expect.anything(),
      ),
    )
  })

  it("uses one room websocket for the detail page and chat", () => {
    renderWithQuery(<RoomDetailPage room={room} />)

    expect(mocks.useRoomSocket).toHaveBeenCalledTimes(1)
  })

  it("leaves the room and returns to the catalog", async () => {
    const user = userEvent.setup()
    server.use(
      charactersHandler(),
      http.delete(
        "http://localhost:8000/api/rooms/room-1/leave",
        () => new HttpResponse(null, { status: 204 }),
      ),
    )
    renderWithQuery(<RoomDetailPage room={room} />)

    await user.click(screen.getByRole("button", { name: "Покинуть" }))

    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith("/rooms"))
  })
})
