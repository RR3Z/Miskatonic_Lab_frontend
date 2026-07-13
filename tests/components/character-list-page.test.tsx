import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { HttpResponse, http } from "msw"
import type * as React from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { CharacterListPage } from "@/components/character/character-list-page"
import { QueryProvider } from "@/lib/api/provider"
import { server } from "../mocks/server"

const mocks = vi.hoisted(() => ({
  getToken: vi.fn(async () => "test-token"),
  toastError: vi.fn(),
}))

vi.mock("@clerk/nextjs", () => ({
  useAuth: () => ({
    getToken: mocks.getToken,
    isLoaded: true,
    isSignedIn: true,
  }),
}))

vi.mock("sonner", () => ({
  toast: { error: mocks.toastError },
}))

function renderWithQuery(ui: React.ReactNode) {
  return render(<QueryProvider>{ui}</QueryProvider>)
}

function apiCharacter(id = "character-1") {
  return {
    id,
    name: `Сыщик ${id}`,
    occupation: "Антиквар",
    age: 48,
    sex: "male",
    residence: "США, Нью-Йорк",
    birthplace: "Бостон",
    portrait_url: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    hp: { current_hp: 6, max_hp: 20 },
    mp: { current_mp: 9, max_mp: 25 },
    sanity: { current_sanity: 15, max_sanity: 30 },
    luck: { current_luck: 80, starting_luck: 100 },
  }
}

describe("CharacterListPage", () => {
  beforeEach(() => {
    mocks.toastError.mockClear()
  })

  it("renders fetched characters and keeps disabled create card last", async () => {
    server.use(
      http.get("http://localhost:8000/api/characters/", () =>
        HttpResponse.json([apiCharacter()]),
      ),
    )
    renderWithQuery(<CharacterListPage />)

    await screen.findByRole("heading", {
      name: /список персонажей \(1\/30\)/i,
    })
    const buttons = screen.getAllByRole("button")
    expect(buttons.at(-1)).toHaveTextContent("Создать нового сыщика")
    expect(buttons.at(-1)).toBeDisabled()
  })

  it("shows only 0/30 and create card for an empty list", async () => {
    server.use(
      http.get("http://localhost:8000/api/characters/", () =>
        HttpResponse.json([]),
      ),
    )
    renderWithQuery(<CharacterListPage />)

    await screen.findByRole("heading", {
      name: /список персонажей \(0\/30\)/i,
    })
    expect(
      screen.queryByText("У вас пока нет персонажей"),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /создать нового сыщика/i }),
    ).toBeDisabled()
  })

  it("shows the disabled limit card at 30/30", async () => {
    server.use(
      http.get("http://localhost:8000/api/characters/", () =>
        HttpResponse.json(
          Array.from({ length: 30 }, (_, index) =>
            apiCharacter(`character-${index}`),
          ),
        ),
      ),
    )
    renderWithQuery(<CharacterListPage />)

    await screen.findByRole("heading", {
      name: /список персонажей \(30\/30\)/i,
    })
    expect(
      screen.getByRole("button", { name: /достигнут лимит персонажей/i }),
    ).toBeDisabled()
  })

  it("reports list loading failure through a deduplicated Sonner toast", async () => {
    server.use(
      http.get("http://localhost:8000/api/characters/", () =>
        HttpResponse.json({ error: "failed" }, { status: 400 }),
      ),
    )
    renderWithQuery(<CharacterListPage />)

    await waitFor(
      () =>
        expect(mocks.toastError).toHaveBeenCalledWith(
          "Не удалось загрузить персонажей. Попробуйте позже.",
          { id: "characters-load-error" },
        ),
      { timeout: 4000 },
    )
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })

  it("deletes a character after confirmation and refreshes the list", async () => {
    const user = userEvent.setup()
    let deleted = false
    server.use(
      http.delete("http://localhost:8000/api/characters/character-1/", () => {
        deleted = true
        return new HttpResponse(null, { status: 204 })
      }),
      http.get("http://localhost:8000/api/characters/", () =>
        HttpResponse.json(deleted ? [] : [apiCharacter()]),
      ),
    )
    renderWithQuery(<CharacterListPage />)

    await screen.findByText("Сыщик character-1")
    await user.click(
      screen.getByRole("button", {
        name: "Действия персонажа Сыщик character-1",
      }),
    )
    await user.click(screen.getByRole("menuitem", { name: "Удалить" }))
    await user.click(screen.getByRole("button", { name: "Удалить" }))

    await screen.findByRole("heading", {
      name: /список персонажей \(0\/30\)/i,
    })
    expect(screen.queryByText("Сыщик character-1")).not.toBeInTheDocument()
  })

  it("keeps delete dialog open and reports failure through Sonner", async () => {
    const user = userEvent.setup()
    server.use(
      http.get("http://localhost:8000/api/characters/", () =>
        HttpResponse.json([apiCharacter()]),
      ),
      http.delete("http://localhost:8000/api/characters/character-1/", () =>
        HttpResponse.json({ error: "failed" }, { status: 500 }),
      ),
    )
    renderWithQuery(<CharacterListPage />)

    await screen.findByText("Сыщик character-1")
    await user.click(
      screen.getByRole("button", {
        name: "Действия персонажа Сыщик character-1",
      }),
    )
    await user.click(screen.getByRole("menuitem", { name: "Удалить" }))
    await user.click(screen.getByRole("button", { name: "Удалить" }))

    await waitFor(() =>
      expect(mocks.toastError).toHaveBeenCalledWith(
        "Не удалось удалить персонажа. Попробуйте ещё раз.",
        { id: "character-delete-error-character-1" },
      ),
    )
    expect(screen.getByRole("alertdialog")).toBeVisible()
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })
})
