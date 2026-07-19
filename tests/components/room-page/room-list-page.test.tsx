import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithQuery } from "@tests/helpers/render-with-query"
import { server } from "@tests/mocks/server"
import { HttpResponse, http } from "msw"
import { useState } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { RoomCatalogPage } from "@/components/room/catalog/room-catalog-page"
import { CreateRoomModal } from "@/components/room/create/create-room-modal"
import roomContentRu from "@/data/room/room.ru.json"

const mocks = vi.hoisted(() => ({
  getToken: vi.fn(async () => "test-token"),
  replace: vi.fn(),
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

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mocks.replace }),
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
    mocks.replace.mockClear()
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
            name: "Arkham after midnight",
          },
        ]),
      ),
    )
    renderWithQuery(<RoomCatalogPage />)

    expect(await screen.findByText("Arkham after midnight")).toBeVisible()
    expect(screen.getByText("2 / 7")).toBeVisible()
    expect(
      screen.getByRole("link", { name: roomContentRu.catalog.open }),
    ).toHaveAttribute("href", "/rooms/room-1")
    expect(screen.queryByText("invite-token")).not.toBeInTheDocument()
  })

  it("opens password entry for room user has not joined", async () => {
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
            name: "Call of Cthulhu",
          },
        ]),
      ),
    )
    renderWithQuery(<RoomCatalogPage />)

    await user.click(
      await screen.findByRole("button", { name: roomContentRu.catalog.join }),
    )

    expect(
      screen.getByRole("heading", { name: roomContentRu.join.title }),
    ).toBeVisible()
    expect(
      screen.getByLabelText(roomContentRu.join.passwordLabel),
    ).toBeVisible()
  })

  it("replaces the catalog with the current server list after manual refresh", async () => {
    const user = userEvent.setup()
    let requestCount = 0
    server.use(
      http.get("http://localhost:8000/api/rooms/", () => {
        requestCount += 1
        return HttpResponse.json(
          requestCount === 1
            ? [
                {
                  created_at: "2026-07-19T10:00:00Z",
                  id: "room-1",
                  is_member: true,
                  max_players: 7,
                  member_count: 2,
                  name: "Existing room",
                },
                {
                  created_at: "2026-07-19T10:01:00Z",
                  id: "room-2",
                  is_member: false,
                  max_players: 7,
                  member_count: 1,
                  name: "Deleted room",
                },
              ]
            : [
                {
                  created_at: "2026-07-19T10:00:00Z",
                  id: "room-1",
                  is_member: true,
                  max_players: 7,
                  member_count: 2,
                  name: "Existing room",
                },
              ],
        )
      }),
    )
    renderWithQuery(<RoomCatalogPage />)

    expect(await screen.findByText("Deleted room")).toBeVisible()
    await user.click(
      screen.getByRole("button", {
        name: roomContentRu.catalog.refreshAriaLabel,
      }),
    )

    await waitFor(() => expect(requestCount).toBe(2))
    await waitFor(() =>
      expect(screen.queryByText("Deleted room")).not.toBeInTheDocument(),
    )
    expect(screen.getByText("Existing room")).toBeVisible()
  })

  it("creates a room and opens it", async () => {
    const user = userEvent.setup()
    server.use(
      http.post("http://localhost:8000/api/rooms/", async ({ request }) => {
        await expect(request.json()).resolves.toEqual({
          max_players: 3,
          name: "Masks",
          password: "keeper-password",
        })
        return HttpResponse.json(
          {
            created_at: "2026-07-19T10:00:00Z",
            id: "room-1",
            invite_token: "invite-token",
            last_activity_at: "2026-07-19T10:00:00Z",
            max_players: 3,
            name: "Masks",
            owner_id: "user-1",
            updated_at: "2026-07-19T10:00:00Z",
          },
          { status: 201 },
        )
      }),
    )
    renderWithQuery(<ModalHarness />)

    await user.type(
      screen.getByLabelText(roomContentRu.create.nameLabel),
      "Masks",
    )
    await user.type(
      screen.getByLabelText(roomContentRu.create.passwordLabel),
      "keeper-password",
    )
    await user.clear(
      screen.getByLabelText(roomContentRu.create.maxPlayersLabel),
    )
    await user.type(
      screen.getByLabelText(roomContentRu.create.maxPlayersLabel),
      "3",
    )
    await user.click(
      screen.getByRole("button", { name: roomContentRu.create.submit }),
    )

    await waitFor(() =>
      expect(mocks.replace).toHaveBeenCalledWith("/rooms/room-1"),
    )
  })
})
