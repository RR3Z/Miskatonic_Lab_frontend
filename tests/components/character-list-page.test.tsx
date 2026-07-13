import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { delay, HttpResponse, http } from "msw"
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
        return HttpResponse.json([apiCharacter()])
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
    expect(
      document.querySelectorAll('[data-slot="character-motion-item"]'),
    ).toHaveLength(1)
    expect(
      document.querySelector('[data-slot="create-character-motion-item"]'),
    ).toContainElement(buttons.at(-1) ?? null)
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
    await user.click(screen.getByLabelText("Пол"))
    await user.click(screen.getByRole("option", { name: "Мужчина" }))
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
    expect(name).toHaveAttribute("data-slot", "input")
    expect(sex).toHaveAttribute("data-slot", "select-trigger")
    expect(document.querySelector('[data-slot="attachment"]')).toHaveAttribute(
      "data-state",
      "idle",
    )
    expect(screen.getByText("1 файл").parentElement).toHaveTextContent(
      /1 файл.*JPEG, PNG или WebP.*до 5 МБ/,
    )
    expect(name).toBeRequired()
    expect(name).toHaveAttribute("placeholder", "Например, Харви Уолтерс")
    expect(age).not.toBeRequired()
    expect(age).toHaveClass("[appearance:textfield]")
    expect(age).toHaveAttribute("placeholder", "Например, 42")
    expect(sex).not.toBeRequired()
    expect(portrait).not.toBeRequired()
  })

  it("keeps the modal open while using the select dropdown", async () => {
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
    const dialog = screen.getByRole("dialog", { name: /новый персонаж/i })

    await user.click(screen.getByLabelText("Пол"))
    const selectContent = screen.getByRole("listbox")
    expect(selectContent).toHaveAttribute("data-side", "bottom")
    await user.click(screen.getByRole("option", { name: "Мужчина" }))

    expect(dialog).toBeVisible()
    expect(screen.getByLabelText("Пол")).toHaveTextContent("Мужчина")
  })

  it("highlights the required name only after a failed submit", async () => {
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
    expect(name).toHaveAttribute("aria-invalid", "false")
    expect(screen.getByRole("button", { name: "Отмена" })).toHaveAttribute(
      "data-variant",
      "destructive",
    )
    expect(
      screen.getByRole("button", { name: "Создать персонажа" }),
    ).toHaveAttribute("data-variant", "success")

    await user.click(screen.getByRole("button", { name: "Создать персонажа" }))

    expect(name).toHaveAttribute("aria-invalid", "true")
    expect(name).toHaveFocus()
    expect(screen.getByText("Укажите имя персонажа")).toBeVisible()

    await user.type(name, "А")
    expect(name).toHaveAttribute("aria-invalid", "false")
    expect(screen.queryByText("Укажите имя персонажа")).not.toBeInTheDocument()
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
    await user.click(screen.getByLabelText("Пол"))
    await user.click(screen.getByRole("option", { name: "Женщина" }))
    await user.upload(
      screen.getByLabelText("Выбрать изображение"),
      new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47])], "portrait.png", {
        type: "image/png",
      }),
    )
    expect(URL.createObjectURL).toHaveBeenCalledOnce()
    expect(document.querySelector('[data-slot="attachment"]')).toHaveAttribute(
      "data-state",
      "done",
    )
    expect(screen.getByText("portrait.png")).toBeVisible()
    expect(
      screen.getByRole("button", { name: "Удалить выбранный портрет" }),
    ).toBeVisible()
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
