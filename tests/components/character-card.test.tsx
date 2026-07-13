import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { CharacterCard } from "@/components/character/character-card"
import type { CharacterListItem } from "@/types/character"

const character: CharacterListItem = {
  id: "character-1",
  name: "Артур Нейтан Кэллахан",
  occupation: "Антиквар",
  age: 48,
  sex: null,
  residence: "США, Нью-Йорк",
  birthplace: null,
  portrait_url: null,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
  hp: { current: 6, max: 20 },
  mp: { current: 9, max: 25 },
  sanity: { current: 15, max: 30 },
  luck: { current: 80, starting: 100 },
}

describe("CharacterCard", () => {
  it("renders the reference-sized card and four-column stats", () => {
    render(<CharacterCard character={character} onDelete={vi.fn()} />)

    const card = screen.getByRole("article")
    expect(card).toHaveClass("h-[104px]", "p-[6px]")
    expect(card).toHaveAttribute("data-slot", "card")
    const tentacle = screen.getByTestId("character-card-tentacle")
    expect(tentacle).toHaveClass(
      "pointer-events-none",
      "absolute",
      "inset-0",
      "bg-cover",
      "opacity-[0.09]",
    )
    expect(tentacle.style.backgroundImage).toContain("character-card-tentacle")
    expect(screen.getByAltText("Мужской портрет")).toBeVisible()
    expect(screen.getByTestId("character-stats")).toHaveClass(
      "grid",
      "grid-cols-4",
    )
    expect(screen.getByText("6/20")).toBeVisible()
    expect(screen.getByText("9/25")).toBeVisible()
    expect(screen.getByText("15/30")).toBeVisible()
    expect(screen.getByText("80/100")).toBeVisible()
    expect(screen.getByTitle("Здоровье")).toBeVisible()
    expect(screen.getByTitle("Магия")).toBeVisible()
    expect(screen.getByTitle("Рассудок")).toBeVisible()
    expect(screen.getByTitle("Удача")).toBeVisible()
  })

  it("keeps the desktop-only delete menu and cancel behavior", async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    render(<CharacterCard character={character} onDelete={onDelete} />)

    const actions = screen.getByRole("button", {
      name: `Действия персонажа ${character.name}`,
    })
    expect(actions).toHaveClass("hidden", "sm:inline-flex")

    await user.click(actions)
    const deleteItem = screen.getByRole("menuitem", { name: "Удалить" })
    expect(deleteItem).toHaveAttribute("data-slot", "dropdown-menu-item")
    await user.click(deleteItem)
    expect(screen.getByRole("alertdialog")).toHaveAttribute(
      "data-slot",
      "alert-dialog-content",
    )

    await user.click(screen.getByRole("button", { name: "Отмена" }))
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument()
    expect(onDelete).not.toHaveBeenCalled()
  })
})
