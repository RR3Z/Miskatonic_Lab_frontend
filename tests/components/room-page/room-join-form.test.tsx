import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithQuery } from "@tests/helpers/render-with-query"
import { server } from "@tests/mocks/server"
import { HttpResponse, http } from "msw"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { RoomJoinForm } from "@/components/room/join/room-join-form"

const mocks = vi.hoisted(() => ({
  getToken: vi.fn(async () => "test-token"),
  joined: vi.fn(),
  toastError: vi.fn(),
  toastSuccess: vi.fn(),
}))

vi.mock("@clerk/nextjs", () => ({
  useAuth: () => ({
    getToken: mocks.getToken,
    isLoaded: true,
    isSignedIn: true,
    userId: "player-1",
  }),
}))

vi.mock("sonner", () => ({
  toast: {
    error: mocks.toastError,
    success: mocks.toastSuccess,
  },
}))

function joinedMember() {
  return {
    character_id: "00000000-0000-0000-0000-000000000000",
    id: "member-1",
    joined_at: "2026-07-19T10:00:00Z",
    role: "player",
    room_id: "room-1",
    user_id: "player-1",
  }
}

describe("RoomJoinForm", () => {
  beforeEach(() => {
    mocks.getToken.mockClear()
    mocks.joined.mockClear()
    mocks.toastError.mockClear()
    mocks.toastSuccess.mockClear()
  })

  it("requires a password when there is no invitation token", async () => {
    const user = userEvent.setup()
    renderWithQuery(<RoomJoinForm onJoined={mocks.joined} roomId="room-1" />)

    await user.click(screen.getByRole("button", { name: "Войти в комнату" }))

    expect(mocks.toastError).toHaveBeenCalledWith(
      "client.validation_failed — Проверьте данные формы",
      expect.objectContaining({ description: expect.anything() }),
    )
  })

  it("joins from the catalog using a password", async () => {
    const user = userEvent.setup()
    server.use(
      http.post(
        "http://localhost:8000/api/rooms/room-1/join",
        async ({ request }) => {
          await expect(request.json()).resolves.toEqual({
            password: "keeper-password",
          })
          return HttpResponse.json(joinedMember())
        },
      ),
    )
    renderWithQuery(<RoomJoinForm onJoined={mocks.joined} roomId="room-1" />)

    await user.type(screen.getByLabelText("Пароль"), "keeper-password")
    await user.click(screen.getByRole("button", { name: "Войти в комнату" }))

    await waitFor(() => expect(mocks.joined).toHaveBeenCalledOnce())
    expect(mocks.toastSuccess).toHaveBeenCalledWith("Вы вошли в комнату.")
  })

  it("joins from an invitation link without asking for a password", async () => {
    const user = userEvent.setup()
    server.use(
      http.post(
        "http://localhost:8000/api/rooms/room-1/join",
        async ({ request }) => {
          await expect(request.json()).resolves.toEqual({
            invite_token: "invite-token",
          })
          return HttpResponse.json(joinedMember())
        },
      ),
    )
    renderWithQuery(
      <RoomJoinForm
        inviteToken="invite-token"
        onJoined={mocks.joined}
        roomId="room-1"
      />,
    )

    await user.click(screen.getByRole("button", { name: "Войти в комнату" }))

    await waitFor(() => expect(mocks.joined).toHaveBeenCalledOnce())
  })

  it("explains a full room without treating the user as joined", async () => {
    const user = userEvent.setup()
    server.use(
      http.post("http://localhost:8000/api/rooms/room-1/join", () =>
        HttpResponse.json({ code: "room.full" }, { status: 409 }),
      ),
    )
    renderWithQuery(
      <RoomJoinForm
        inviteToken="invite-token"
        onJoined={mocks.joined}
        roomId="room-1"
      />,
    )

    await user.click(screen.getByRole("button", { name: "Войти в комнату" }))

    await waitFor(() =>
      expect(mocks.toastError).toHaveBeenCalledWith(
        "room.full — Комната заполнена",
        expect.objectContaining({ description: expect.anything() }),
      ),
    )
    expect(mocks.joined).not.toHaveBeenCalled()
  })
})
