import { render, screen, waitFor } from "@testing-library/react"
import type * as React from "react"
import { describe, expect, it, vi } from "vitest"

import { CharacterListPage } from "@/components/character/character-list-page"
import { QueryProvider } from "@/lib/api/provider"

const clerkState = vi.hoisted(() => ({
  signedIn: true,
}))

vi.mock("@clerk/nextjs", () => ({
  SignInButton: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => ({ getToken: async () => "test-token" }),
  useUser: () => ({ isSignedIn: clerkState.signedIn }),
}))

function renderWithQuery(ui: React.ReactNode) {
  return render(<QueryProvider>{ui}</QueryProvider>)
}

describe("CharacterListPage", () => {
  it("renders fetched characters and keeps create card last", async () => {
    renderWithQuery(<CharacterListPage />)

    await screen.findByRole("heading", { name: /список персонажей/i })
    await screen.findByText("Артур Нейтан Кэллахан")

    const cardsAndButtons = screen.getAllByRole("button")
    expect(cardsAndButtons.at(-1)).toHaveTextContent("Создание персонажа")
  })

  it("opens auth action for signed-out create card", async () => {
    clerkState.signedIn = false

    renderWithQuery(<CharacterListPage />)

    await screen.findByText("Артур Нейтан Кэллахан")

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /создать нового сыщика/i }),
      ).toBeVisible()
    })
  })
})
