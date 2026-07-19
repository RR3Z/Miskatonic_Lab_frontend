import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithQuery } from "@tests/helpers/render-with-query"
import { server } from "@tests/mocks/server"
import { HttpResponse, http } from "msw"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { JoinRoomModal } from "@/components/room/join/join-room-modal"

const mocks = vi.hoisted(() => ({
  getToken: vi.fn(async () => "test-token"),
  onOpenChange: vi.fn(),
  replace: vi.fn(),
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

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mocks.replace }),
}))

vi.mock("sonner", () => ({
  toast: {
    error: mocks.toastError,
    success: mocks.toastSuccess,
  },
}))

describe("JoinRoomModal", () => {
  beforeEach(() => {
    mocks.onOpenChange.mockClear()
    mocks.replace.mockClear()
  })

  it("opens the joined room", async () => {
    const user = userEvent.setup()
    server.use(
      http.post("http://localhost:8000/api/rooms/room-1/join", () =>
        HttpResponse.json({
          character_id: "00000000-0000-0000-0000-000000000000",
          id: "member-1",
          joined_at: "2026-07-19T10:00:00Z",
          role: "player",
          room_id: "room-1",
          user_id: "player-1",
        }),
      ),
    )
    renderWithQuery(
      <JoinRoomModal
        onOpenChange={mocks.onOpenChange}
        open
        room={{
          created_at: "2026-07-19T10:00:00Z",
          id: "room-1",
          is_member: false,
          max_players: 7,
          member_count: 1,
          name: "Зов Ктулху",
        }}
      />,
    )

    await user.type(screen.getByLabelText("Пароль"), "keeper-password")
    await user.click(screen.getByRole("button", { name: "Войти в комнату" }))

    await waitFor(() => expect(mocks.onOpenChange).toHaveBeenCalledWith(false))
    expect(mocks.replace).toHaveBeenCalledWith("/rooms/room-1")
  })
})
