import { screen } from "@testing-library/react"
import { renderWithQuery } from "@tests/helpers/render-with-query"
import { server } from "@tests/mocks/server"
import { HttpResponse, http } from "msw"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { RoomCharacterSheet } from "@/components/room/detail/room-character-sheet"
import roomContentRu from "@/data/room/room.ru.json"

const mocks = vi.hoisted(() => ({
  getToken: vi.fn(async () => "test-token"),
}))

vi.mock("@clerk/nextjs", () => ({
  useAuth: () => ({
    getToken: mocks.getToken,
    isLoaded: true,
    userId: "gm-1",
  }),
}))

vi.mock("@/components/character/detail/header/character-sheet-header", () => ({
  CharacterSheetHeader: ({ character }: { character: { name: string } }) => (
    <h2>{character.name}</h2>
  ),
}))

vi.mock(
  "@/components/character/detail/layout/character-sheet-workspace",
  () => ({
    CharacterSheetWorkspace: () => <div>Содержимое листа</div>,
  }),
)

function selectedCharactersHandler() {
  return http.get("http://localhost:8000/api/rooms/room-1/characters", () =>
    HttpResponse.json([
      {
        character: { id: "character-1", name: "Роланд" },
        member_id: "member-1",
        role: "player",
        user_id: "player-1",
      },
    ]),
  )
}

describe("RoomCharacterSheet", () => {
  beforeEach(() => {
    server.use(selectedCharactersHandler())
  })

  it("loads the selected sheet through the Room API", async () => {
    renderWithQuery(
      <RoomCharacterSheet readOnly={false} roomId="room-1" userId="player-1" />,
    )

    expect(await screen.findByRole("heading", { name: "Роланд" })).toBeVisible()
    expect(screen.getByText("Содержимое листа")).toBeVisible()
  })

  it("marks GM view read-only and provides a return action", async () => {
    const onBack = vi.fn()
    renderWithQuery(
      <RoomCharacterSheet
        onBack={onBack}
        readOnly
        roomId="room-1"
        userId="player-1"
      />,
    )

    expect(
      await screen.findByRole("region", {
        name: roomContentRu.detail.sheetReadOnlyLabel,
      }),
    ).toBeVisible()
    await screen.findByRole("button", { name: roomContentRu.detail.sheetBack })
  })
})
