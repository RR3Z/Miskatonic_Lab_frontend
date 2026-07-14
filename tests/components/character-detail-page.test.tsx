import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

const queryState = vi.hoisted(() => ({
  data: undefined as
    | {
        age: number | null
        name: string
        occupation: string | null
      }
    | undefined,
  error: null as unknown,
  isFetching: false,
  isPending: false,
  refetch: vi.fn(),
}))

vi.mock("@/lib/api/use-characters", () => ({
  useCharacter: () => queryState,
}))

import { CharacterDetailPage } from "@/components/character/detail/character-detail-page"

describe("CharacterDetailPage", () => {
  beforeEach(() => {
    queryState.data = undefined
    queryState.error = null
    queryState.isFetching = false
    queryState.isPending = false
    queryState.refetch.mockReset()
  })

  it("renders the loaded character and list navigation", () => {
    queryState.data = {
      age: 48,
      name: "Артур Кэллахан",
      occupation: "Антиквар",
    }

    render(<CharacterDetailPage characterId="character-1" />)

    expect(
      screen.getByRole("heading", { name: "Артур Кэллахан" }),
    ).toBeVisible()
    expect(screen.getByText("Антиквар, 48 лет")).toBeVisible()
    expect(
      screen.getByRole("link", { name: "К списку персонажей" }),
    ).toHaveAttribute("href", "/characters")
  })

  it("renders a loading skeleton", () => {
    queryState.isPending = true

    render(<CharacterDetailPage characterId="character-1" />)

    expect(screen.getByText("Загрузка листа персонажа…")).toBeInTheDocument()
  })

  it("renders the not-found state for a 404 response", () => {
    queryState.error = { response: new Response(null, { status: 404 }) }

    render(<CharacterDetailPage characterId="missing" />)

    expect(screen.getByText("Персонаж не найден")).toBeVisible()
    expect(
      screen.getByRole("link", { name: "К списку персонажей" }),
    ).toHaveAttribute("href", "/characters")
  })

  it("retries a recoverable loading error", async () => {
    const user = userEvent.setup()
    queryState.error = new Error("network failed")
    queryState.refetch.mockResolvedValue(undefined)

    render(<CharacterDetailPage characterId="character-1" />)
    await user.click(screen.getByRole("button", { name: "Повторить" }))

    expect(queryState.refetch).toHaveBeenCalledOnce()
  })
})
