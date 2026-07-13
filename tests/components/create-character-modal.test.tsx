import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { HttpResponse, http } from "msw"
import { useState } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { CreateCharacterModal } from "@/components/character/create/create-character-modal"
import { renderWithQuery } from "../helpers/render-with-query"
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
    userId: "user-1",
  }),
}))

vi.mock("sonner", () => ({
  toast: {
    error: mocks.toastError,
    success: mocks.toastSuccess,
    warning: mocks.toastWarning,
  },
}))

function ModalHarness() {
  const [open, setOpen] = useState(true)

  return <CreateCharacterModal open={open} onOpenChange={setOpen} />
}

function renderModal() {
  return renderWithQuery(<ModalHarness />)
}

function portraitFile() {
  return new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47])], "portrait.png", {
    type: "image/png",
  })
}

describe("CreateCharacterModal", () => {
  beforeEach(() => {
    mocks.getToken.mockClear()
    mocks.toastError.mockClear()
    mocks.toastSuccess.mockClear()
    mocks.toastWarning.mockClear()
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: vi.fn(() => "blob:portrait-preview"),
    })
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: vi.fn(),
    })
  })

  it("creates a character and closes the modal", async () => {
    const user = userEvent.setup()
    server.use(
      http.post(
        "http://localhost:8000/api/characters/",
        async ({ request }) => {
          const body = await request.json()
          expect(body).toEqual({ name: "Армитедж", age: 56, sex: "male" })
          return HttpResponse.json(
            {
              id: "created-character",
              name: "Армитедж",
              age: 56,
              sex: "male",
              portrait_url: null,
            },
            { status: 201 },
          )
        },
      ),
    )
    renderModal()

    await user.type(screen.getByLabelText("Имя"), "Армитедж")
    await user.click(screen.getByLabelText("Пол"))
    await user.click(screen.getByRole("option", { name: "Мужчина" }))
    await user.type(screen.getByLabelText("Возраст"), "56")
    await user.click(screen.getByRole("button", { name: "Создать персонажа" }))

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    )
    expect(mocks.toastSuccess).toHaveBeenCalledWith("Персонаж создан")
  })

  it("marks only the name as required and shows creation placeholders", () => {
    renderModal()

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

  it("keeps the modal open while using the sex select", async () => {
    const user = userEvent.setup()
    renderModal()
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
    renderModal()
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
    renderModal()

    await user.upload(
      screen.getByLabelText("Выбрать изображение"),
      portraitFile(),
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

  it("keeps successful creation when portrait upload fails", async () => {
    const user = userEvent.setup()
    server.use(
      http.post("http://localhost:8000/api/characters/", () =>
        HttpResponse.json(
          {
            age: null,
            id: "partial-character",
            name: "Лавиния",
            portrait_url: null,
            sex: null,
          },
          { status: 201 },
        ),
      ),
      http.patch(
        "http://localhost:8000/api/characters/partial-character/",
        () => HttpResponse.json({ error: "upload failed" }, { status: 500 }),
      ),
    )
    renderModal()

    await user.type(screen.getByLabelText("Имя"), "Лавиния")
    await user.upload(
      screen.getByLabelText("Выбрать изображение"),
      portraitFile(),
    )
    await user.click(screen.getByRole("button", { name: "Создать персонажа" }))

    await waitFor(() =>
      expect(mocks.toastWarning).toHaveBeenCalledWith(
        "Персонаж создан, но портрет загрузить не удалось",
      ),
    )
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("keeps the modal open and explains the character limit error", async () => {
    const user = userEvent.setup()
    server.use(
      http.post("http://localhost:8000/api/characters/", () =>
        HttpResponse.json({ code: "character.limit_reached" }, { status: 409 }),
      ),
    )
    renderModal()

    await user.type(screen.getByLabelText("Имя"), "Лишний сыщик")
    await user.click(screen.getByRole("button", { name: "Создать персонажа" }))

    await waitFor(() =>
      expect(mocks.toastError).toHaveBeenCalledWith(
        "Достигнут лимит персонажей",
        { id: "character-create-error" },
      ),
    )
    expect(screen.getByRole("dialog")).toBeVisible()
  })
})
