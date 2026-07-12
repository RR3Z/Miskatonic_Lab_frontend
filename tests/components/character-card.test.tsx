import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

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
  it("renders character identity, default male portrait, and stats", () => {
    render(<CharacterCard character={character} />)

    expect(screen.getByRole("heading", { name: character.name })).toBeVisible()
    expect(screen.getByAltText("Мужской портрет")).toBeVisible()
    expect(screen.getByText("6/20")).toBeVisible()
    expect(screen.getByText("9/25")).toBeVisible()
    expect(screen.getByText("15/30")).toBeVisible()
    expect(screen.getByText("80/100")).toBeVisible()
  })
})
