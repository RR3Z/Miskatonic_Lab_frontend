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
  toastSuccess: vi.fn(),
  toastWarning: vi.fn(),
}))

vi.mock("@clerk/nextjs", () => ({
  useAuth: () => ({
    getToken: mocks.getToken,
    isLoaded: true,
    isSignedIn: true,
  }),
}))

vi.mock("sonner", () => ({
  toast: {
    error: mocks.toastError,
    success: mocks.toastSuccess,
    warning: mocks.toastWarning,
  },
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
    mocks.toastSuccess.mockClear()
    mocks.toastWarning.mockClear()
    window.history.replaceState({}, "", "/")
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: vi.fn(() => "blob:portrait-preview"),
    })
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: vi.fn(),
    })
  })

  it("renders fetched characters and keeps active create card last", async () => {
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
    expect(buttons.at(-1)).toBeEnabled()
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
            apiCharacter(`character-${index}`),
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

  it("creates a character from the modal and refreshes the list", async () => {
    const user = userEvent.setup()
    let created = false
    server.use(
      http.get("http://localhost:8000/api/characters/", () =>
        HttpResponse.json(created ? [apiCharacter("created-character")] : []),
      ),
      http.post(
        "http://localhost:8000/api/characters/",
        async ({ request }) => {
          const body = (await request.json()) as {
            name: string
            age: number | null
            sex: string | null
          }
          expect(body).toEqual({ name: "Армитедж", age: 56, sex: "male" })
          created = true
          return HttpResponse.json(
            {
              id: "created-character",
              name: body.name,
              age: body.age,
              sex: body.sex,
              portrait_url: null,
            },
            { status: 201 },
          )
        },
      ),
    )
    renderWithQuery(<CharacterListPage />)

    await user.click(
      await screen.findByRole("button", { name: /создать нового сыщика/i }),
    )
    expect(
      screen.getByRole("dialog", { name: /новый персонаж/i }),
    ).toBeVisible()

    await user.type(screen.getByLabelText("Имя"), "Армитедж")
    await user.selectOptions(screen.getByLabelText("Пол"), "male")
    await user.type(screen.getByLabelText("Возраст"), "56")
    await user.click(screen.getByRole("button", { name: "Создать персонажа" }))

    await screen.findByRole("heading", {
      name: /список персонажей \(1\/30\)/i,
    })
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect(mocks.toastSuccess).toHaveBeenCalledWith("Персонаж создан")
  })

  it("marks only the name as required and shows creation placeholders", async () => {
    const user = userEvent.setup()
    server.use(
      http.get("http://localhost:8000/api/characters/", () =>
        HttpResponse.json([]),
      ),
    )
    renderWithQuery(<CharacterListPage />)

    await user.click(
      await screen.findByRole("button", { name: /создать нового сыщика/i }),
    )

    const name = screen.getByLabelText("Имя")
    const age = screen.getByLabelText("Возраст")
    const sex = screen.getByLabelText("Пол")
    const portrait = screen.getByLabelText("Выбрать изображение")
    expect(name).toBeRequired()
    expect(name).toHaveAttribute("placeholder", "Например, Харви Уолтерс")
    expect(age).not.toBeRequired()
    expect(age).toHaveAttribute("placeholder", "Например, 42")
    expect(sex).not.toBeRequired()
    expect(portrait).not.toBeRequired()
  })

  it("accepts a portrait file and shows the selected state", async () => {
    const user = userEvent.setup()
    server.use(
      http.get("http://localhost:8000/api/characters/", () =>
        HttpResponse.json([]),
      ),
      http.post("http://localhost:8000/api/characters/", () =>
        HttpResponse.json(
          {
            id: "portrait-character",
            name: "Лавиния",
            age: null,
            sex: "female",
            portrait_url: null,
          },
          { status: 201 },
        ),
      ),
      http.patch(
        "http://localhost:8000/api/characters/portrait-character/",
        async ({ request }) => {
          const form = await request.formData()
          const portrait = form.get("portrait")
          expect(portrait).not.toBeNull()
          expect((portrait as File).type).toBe("image/png")
          return HttpResponse.json({
            id: "portrait-character",
            name: "Лавиния",
            age: null,
            sex: "female",
            portrait_url:
              "http://localhost:8000/uploads/portraits/portrait.png",
          })
        },
      ),
    )
    renderWithQuery(<CharacterListPage />)

    await user.click(
      await screen.findByRole("button", { name: /создать нового сыщика/i }),
    )
    await user.type(screen.getByLabelText("Имя"), "Лавиния")
    await user.selectOptions(screen.getByLabelText("Пол"), "female")
    await user.upload(
      screen.getByLabelText("Выбрать изображение"),
      new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47])], "portrait.png", {
        type: "image/png",
      }),
    )
    expect(URL.createObjectURL).toHaveBeenCalledOnce()
    expect(
      screen.getByRole("button", { name: "Удалить выбранный портрет" }),
    ).toBeVisible()
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
