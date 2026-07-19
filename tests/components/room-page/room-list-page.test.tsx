import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithQuery } from "@tests/helpers/render-with-query"
import { server } from "@tests/mocks/server"
import { HttpResponse, http } from "msw"
import { useState } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { RoomCatalogPage } from "@/components/room/catalog/room-catalog-page"
import { CreateRoomModal } from "@/components/room/create/create-room-modal"

const mocks = vi.hoisted(() => ({
  getToken: vi.fn(async () => "test-token"),
  toastError: vi.fn(),
  toastSuccess: vi.fn(),
}))

vi.mock("@clerk/nextjs", () => ({
  useAuth: () => ({
    getToken: mocks.getToken,
    isLoaded: true,
    isSignedIn: true,
    userId: "user-1",
  }),
}))

vi.mock("sonner", () => ({
  toast: {
    error: mocks.toastError,
    success: mocks.toastSuccess,
  },
}))

function ModalHarness() {
  const [open, setOpen] = useState(true)
  return <CreateRoomModal open={open} onOpenChange={setOpen} />
}

describe("Room catalog", () => {
  beforeEach(() => {
    mocks.getToken.mockClear()
    mocks.toastError.mockClear()
    mocks.toastSuccess.mockClear()
  })

  it("renders catalog summaries without invitation secrets", async () => {
    server.use(
      http.get("http://localhost:8000/api/rooms/", () =>
        HttpResponse.json([
          {
            created_at: "2026-07-19T10:00:00Z",
            id: "room-1",
            is_member: true,
            max_players: 7,
            member_count: 2,
            name: "Аркхэм после полуночи",
          },
        ]),
      ),
    )
    renderWithQuery(<RoomCatalogPage />)

    expect(await screen.findByText("Аркхэм после полуночи")).toBeVisible()
    expect(screen.getByText("2 / 7")).toBeVisible()
    expect(screen.getByRole("link", { name: "Открыть" })).toHaveAttribute(
      "href",
      "/rooms/room-1",
    )
    expect(screen.queryByText("invite-token")).not.toBeInTheDocument()
  })

  it("opens password entry for a room the user has not joined", async () => {
    const user = userEvent.setup()
    server.use(
      http.get("http://localhost:8000/api/rooms/", () =>
        HttpResponse.json([
          {
            created_at: "2026-07-19T10:00:00Z",
            id: "room-1",
            is_member: false,
            max_players: 7,
            member_count: 2,
            name: "Зов Ктулху",
          },
        ]),
      ),
    )
    renderWithQuery(<RoomCatalogPage />)

    await user.click(await screen.findByRole("button", { name: "Войти" }))

    expect(
      screen.getByRole("heading", { name: "Войти в комнату" }),
    ).toBeVisible()
    expect(screen.getByLabelText("Пароль")).toBeVisible()
  })

  it("creates a room and copies its invitation link", async () => {
    const user = userEvent.setup()
    server.use(
      http.post("http://localhost:8000/api/rooms/", async ({ request }) => {
        await expect(request.json()).resolves.toEqual({
          max_players: 3,
          name: "Маски",
          password: "keeper-password",
        })
        return HttpResponse.json(
          {
            created_at: "2026-07-19T10:00:00Z",
            id: "room-1",
            invite_token: "invite-token",
            last_activity_at: "2026-07-19T10:00:00Z",
            max_players: 3,
            name: "Маски",
            owner_id: "user-1",
            updated_at: "2026-07-19T10:00:00Z",
          },
          { status: 201 },
        )
      }),
    )
    renderWithQuery(<ModalHarness />)

    await user.type(screen.getByLabelText("Название"), "Маски")
    await user.type(screen.getByLabelText("Пароль"), "keeper-password")
    await user.clear(screen.getByLabelText("Лимит игроков"))
    await user.type(screen.getByLabelText("Лимит игроков"), "3")
    await user.click(screen.getByRole("button", { name: "Создать комнату" }))

    const inviteLink = await screen.findByLabelText("Ссылка-приглашение")
    expect((inviteLink as HTMLInputElement).value).toContain(
      "/rooms/room-1?invite=invite-token",
    )
    await user.click(screen.getByRole("button", { name: "Скопировать ссылку" }))
    await waitFor(() => expect(mocks.toastSuccess).toHaveBeenCalled())
    expect(mocks.toastSuccess).toHaveBeenCalledWith(
      "Ссылка-приглашение скопирована.",
    )
  })
})
