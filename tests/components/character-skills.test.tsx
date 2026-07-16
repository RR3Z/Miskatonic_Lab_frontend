import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { CharacterSkills } from "@/components/character/detail/skills/character-skills"
import type { CharacterSkill } from "@/types/character"

const deleteSkillMutation = vi.hoisted(() => ({ mutateAsync: vi.fn() }))

vi.mock("@/lib/api/use-character-skills", () => ({
  useDeleteCharacterSkill: () => deleteSkillMutation,
}))

function characterSkill(
  overrides: Partial<CharacterSkill> & Pick<CharacterSkill, "id" | "name">,
): CharacterSkill {
  return {
    base_value: 20,
    checked: false,
    created_at: "2026-01-01T00:00:00Z",
    specialized: false,
    specialty: null,
    updated_at: "2026-01-01T00:00:00Z",
    value: 20,
    ...overrides,
  }
}

describe("CharacterSkills", () => {
  beforeEach(() => {
    deleteSkillMutation.mutateAsync.mockReset()
    deleteSkillMutation.mutateAsync.mockResolvedValue(undefined)
  })

  it("groups and sorts skills by their Russian initial", () => {
    render(
      <CharacterSkills
        characterId="character-1"
        skills={[
          characterSkill({ id: "library", name: "Библиотечное дело" }),
          characterSkill({ id: "archaeology", name: "Археология" }),
          characterSkill({ id: "anthropology", name: "Антропология" }),
          characterSkill({ id: "language", name: "Иностранный язык" }),
        ]}
      />,
    )

    expect(
      screen
        .getAllByRole("heading", { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual(["А", "Б", "И"])

    const aGroup = screen.getByRole("region", {
      name: "Навыки на букву А",
    })
    expect(
      within(aGroup)
        .getAllByTestId("character-skill")
        .map(
          (skill) =>
            within(skill).getByTestId("character-skill-name").textContent,
        ),
    ).toEqual(["Антропология", "Археология"])
  })

  it("renders the current, base, development, and specialty data", () => {
    render(
      <CharacterSkills
        characterId="character-1"
        skills={[
          characterSkill({
            base_value: 1,
            checked: true,
            id: "latin",
            name: "Иностранный язык",
            specialized: true,
            specialty: {
              base_value: 1,
              created_at: "2026-01-01T00:00:00Z",
              description: "Классическая латынь",
              id: "specialty-latin",
              name: "Латынь",
              updated_at: "2026-01-01T00:00:00Z",
            },
            value: 42,
          }),
        ]}
      />,
    )

    const skill = screen.getByTestId("character-skill")
    expect(within(skill).getByText("Иностранный язык")).toBeVisible()
    expect(within(skill).getByText("Латынь")).toHaveAttribute(
      "title",
      "Классическая латынь",
    )
    expect(
      within(skill).getByTestId("character-skill-base-value"),
    ).toHaveTextContent("1%")
    expect(
      within(skill).getByTestId("character-skill-value"),
    ).toHaveTextContent("42%")
    expect(within(skill).getByText("Базовое значение:")).toHaveClass("sr-only")
    expect(within(skill).getByText("Значение навыка:")).toHaveClass("sr-only")
    expect(within(skill).getByLabelText("Отмечен для развития")).toBeVisible()
  })

  it.each([null, []])("renders an empty state for %j", (skills) => {
    render(<CharacterSkills characterId="character-1" skills={skills} />)

    expect(
      screen.getByText("Навыки персонажа пока не добавлены."),
    ).toBeVisible()
    expect(
      screen.getByRole("button", { name: "Добавить собственный навык" }),
    ).toBeDisabled()
  })

  it("deletes an existing skill after confirmation", async () => {
    const user = userEvent.setup()
    render(
      <CharacterSkills
        characterId="character-1"
        skills={[characterSkill({ id: "library", name: "Библиотека" })]}
      />,
    )

    await user.click(
      screen.getByRole("button", { name: "Удалить навык Библиотека" }),
    )
    await user.click(
      within(
        screen.getByRole("alertdialog", { name: "Удалить навык?" }),
      ).getByRole("button", { name: "Удалить" }),
    )

    await waitFor(() =>
      expect(deleteSkillMutation.mutateAsync).toHaveBeenCalledWith("library"),
    )
  })
})
