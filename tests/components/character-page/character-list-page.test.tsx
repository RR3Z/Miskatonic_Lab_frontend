import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { createApiCharacter } from "@tests/fixtures/character"
import { renderWithQuery } from "@tests/helpers/render-with-query"
import { server } from "@tests/mocks/server"
import { delay, HttpResponse, http } from "msw"
import { describe, expect, it, vi } from "vitest"
import { CharacterListPage } from "@/components/character/character-list-page"

const mocks = vi.hoisted(() => ({
  getToken: vi.fn(async () => "test-token"),
}))

vi.mock("@clerk/nextjs", () => ({
  useAuth: () => ({
    getToken: mocks.getToken,
    isLoaded: true,
    isSignedIn: true,
    userId: "user-1",
  }),
}))

describe("CharacterListPage", () => {
  it("renders one accessible loading status and decorative skeleton cards", () => {
    server.use(
      http.get("http://localhost:8000/api/characters/", async () => {
        await delay(200)
        return HttpResponse.json([])
      }),
    )
    renderWithQuery(<CharacterListPage />)

    expect(screen.getByRole("status")).toHaveTextContent("Загрузка персонажей…")
    expect(
      screen.getByRole("region", { name: "Список персонажей" }),
    ).toHaveAttribute("aria-busy", "true")
    const skeletons = document.querySelectorAll('[data-slot="skeleton"]')
    expect(skeletons).toHaveLength(6)
    for (const skeleton of skeletons) {
      expect(skeleton).toHaveAttribute("aria-hidden", "true")
    }
  })

  it("shows a persistent load error and retries the request", async () => {
    const user = userEvent.setup()
    let shouldFail = true
    server.use(
      http.get("http://localhost:8000/api/characters/", () => {
        if (shouldFail) {
          return HttpResponse.json({ message: "unavailable" }, { status: 400 })
        }
        return HttpResponse.json([createApiCharacter()])
      }),
    )
    renderWithQuery(<CharacterListPage />)

    const alert = await screen.findByRole("alert", undefined, {
      timeout: 3_000,
    })
    expect(alert).toHaveTextContent("Не удалось загрузить персонажей")
    expect(alert).toHaveTextContent(
      "Проверьте подключение и попробуйте получить список ещё раз.",
    )
    expect(
      screen.getByRole("button", {
        name: "Создание персонажа недоступно: список не загружен",
      }),
    ).toBeDisabled()
    expect(
      screen.queryByRole("button", { name: /создать нового сыщика/i }),
    ).not.toBeInTheDocument()

    shouldFail = false
    await user.click(screen.getByRole("button", { name: "Повторить" }))

    await screen.findByRole("heading", {
      name: /список персонажей \(1\/30\)/i,
    })
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })

  it("renders fetched characters and keeps active create card last", async () => {
    server.use(
      http.get("http://localhost:8000/api/characters/", () =>
        HttpResponse.json([createApiCharacter()]),
      ),
    )
    renderWithQuery(<CharacterListPage />)

    await screen.findByRole("heading", {
      name: /список персонажей \(1\/30\)/i,
    })
    const buttons = screen.getAllByRole("button")
    expect(buttons.at(-1)).toHaveTextContent("Создать нового сыщика")
    expect(buttons.at(-1)).toBeEnabled()
    expect(
      document.querySelectorAll('[data-slot="character-motion-item"]'),
    ).toHaveLength(1)
    expect(
      document.querySelector('[data-slot="character-delete-overlay"]'),
    ).toHaveClass(
      "pointer-events-none",
      "absolute",
      "inset-0",
      "bg-destructive",
    )
    expect(
      document.querySelector('[data-slot="create-character-motion-item"]'),
    ).toContainElement(buttons.at(-1) ?? null)
  })

  it("updates the list immediately after delete while refetch stays pending", async () => {
    const user = userEvent.setup()
    let deleted = false

    server.use(
      http.get("http://localhost:8000/api/characters/", async () => {
        if (deleted) await delay(1_000)
        return HttpResponse.json(
          deleted
            ? [createApiCharacter("character-2")]
            : [
                createApiCharacter("character-1"),
                createApiCharacter("character-2"),
              ],
        )
      }),
      http.delete("http://localhost:8000/api/characters/character-1/", () => {
        deleted = true
        return new HttpResponse(null, { status: 204 })
      }),
    )
    renderWithQuery(<CharacterListPage />)

    await screen.findByRole("heading", {
      name: /список персонажей \(2\/30\)/i,
    })
    await user.click(
      screen.getByRole("button", {
        name: "Действия персонажа Сыщик character-1",
      }),
    )
    await user.click(screen.getByRole("menuitem", { name: "Удалить" }))
    await user.click(screen.getByRole("button", { name: "Удалить" }))

    await screen.findByRole("heading", {
      name: /список персонажей \(1\/30\)/i,
    })
    expect(
      screen.getByRole("region", { name: "Список персонажей" }),
    ).toHaveAttribute("aria-busy", "true")
    expect(
      screen.getByRole("heading", { name: "Сыщик character-2" }),
    ).toBeVisible()
    await waitFor(
      () =>
        expect(
          screen.queryByRole("heading", { name: "Сыщик character-1" }),
        ).not.toBeInTheDocument(),
      { timeout: 800 },
    )
    const list = screen.getByRole("region", { name: "Список персонажей" })
    expect(list.lastElementChild).toHaveAttribute(
      "data-slot",
      "create-character-motion-item",
    )
    expect(
      document.querySelector('[data-slot="create-character-motion-item"]'),
    ).toContainElement(
      screen.getByRole("button", { name: /создать нового сыщика/i }),
    )
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
      await screen.findByRole("button", { name: /создать нового сыщика/i }),
    ).toBeEnabled()
  })

  it("hides the create card and disables the red header action at 30/30", async () => {
    server.use(
      http.get("http://localhost:8000/api/characters/", () =>
        HttpResponse.json(
          Array.from({ length: 30 }, (_, index) =>
            createApiCharacter(`character-${index}`),
          ),
        ),
      ),
    )
    renderWithQuery(<CharacterListPage />)

    await screen.findByRole("heading", {
      name: /список персонажей \(30\/30\)/i,
    })
    const limitButton = screen.getByRole("button", {
      name: /создание персонажа недоступно: достигнут лимит/i,
    })
    expect(limitButton).toBeDisabled()
    expect(limitButton).toHaveAttribute("data-variant", "destructive")
    expect(
      screen.queryByRole("button", { name: /создать нового сыщика/i }),
    ).not.toBeInTheDocument()
  })
})
