import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { CharacterSkills } from "@/components/character/detail/skills/character-skills"
import type { CharacterSkill } from "@/types/character.types"

const deleteSkillMutation = vi.hoisted(() => ({ mutateAsync: vi.fn() }))
const createSkillMutation = vi.hoisted(() => ({
  isPending: false,
  mutateAsync: vi.fn(),
}))
const updateSkillMutation = vi.hoisted(() => ({
  isPending: false,
  mutate: vi.fn(),
  mutateAsync: vi.fn(),
}))
const rollMutation = vi.hoisted(() => ({
  isPending: false,
  mutateAsync: vi.fn(),
}))

vi.mock("@/hooks/character/use-create-character-skill", () => ({
  useCreateCharacterSkill: () => createSkillMutation,
}))

vi.mock("@/hooks/character/use-delete-character-skill", () => ({
  useDeleteCharacterSkill: () => deleteSkillMutation,
}))

vi.mock("@/hooks/character/use-update-character-skill", () => ({
  useUpdateCharacterSkill: () => updateSkillMutation,
}))

vi.mock("@/hooks/character/use-character-dice-rolls", () => ({
  useMakeCharacterDiceRoll: () => rollMutation,
}))

function characterSkill(
  overrides: Partial<CharacterSkill> & Pick<CharacterSkill, "id" | "name">,
): CharacterSkill {
  return {
    base_value: 20,
    base_rule: null,
    checked: false,
    created_at: "2026-01-01T00:00:00Z",
    is_protected: false,
    total_value: 40,
    updated_at: "2026-01-01T00:00:00Z",
    value: 20,
    ...overrides,
  }
}

describe("CharacterSkills", () => {
  beforeEach(() => {
    deleteSkillMutation.mutateAsync.mockReset()
    deleteSkillMutation.mutateAsync.mockResolvedValue(undefined)
    createSkillMutation.mutateAsync.mockReset()
    createSkillMutation.mutateAsync.mockResolvedValue(undefined)
    rollMutation.mutateAsync.mockReset()
    rollMutation.mutateAsync.mockResolvedValue({ result: 30 })
    updateSkillMutation.mutate.mockReset()
    updateSkillMutation.mutateAsync.mockReset()
    updateSkillMutation.mutateAsync.mockResolvedValue(undefined)
  })

  it("groups skills by Russian initial and writes the base inside the name", () => {
    render(
      <CharacterSkills
        characterId="character-1"
        characteristics={{ dexterity: null, education: null }}
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
        .getAllByTestId("character-skill-name")
        .map((skill) => skill.textContent),
    ).toEqual(["Антропология (20%)", "Археология (20%)"])
    expect(screen.getByTestId("character-skills-scroll-area")).toContainElement(
      screen.getByTestId("character-skill-groups"),
    )
    expect(screen.getByTestId("character-skills")).toHaveClass(
      "@container/skills",
    )
    expect(screen.getByTestId("character-skill-groups")).toHaveClass(
      "grid",
      "grid-cols-1",
      "@[32rem]/skills:grid-cols-2",
      "@[44rem]/skills:grid-cols-3",
      "@[52rem]/skills:grid-cols-4",
    )
    expect(
      screen
        .getAllByTestId("character-skill-group")
        .map((group) => within(group).getByRole("heading").textContent),
    ).toEqual(["А", "Б", "И"])
    expect(
      within(screen.getByTestId("character-skills-scroll-area")).queryByRole(
        "heading",
        { name: "Навыки" },
      ),
    ).not.toBeInTheDocument()
  })

  it("renders a Dodge-style card, thresholds, and clickable development mark", () => {
    render(
      <CharacterSkills
        characterId="character-1"
        characteristics={{ dexterity: null, education: null }}
        skills={[
          characterSkill({
            base_value: 1,
            checked: true,
            id: "latin",
            name: "Иностранный язык",
            total_value: 43,
            value: 42,
          }),
        ]}
      />,
    )

    const skill = screen.getByTestId("character-skill")
    const skillName = within(skill).getByTestId("character-skill-name")
    expect(skillName).toHaveTextContent("Иностранный язык (1%)")
    expect(skillName).toHaveClass(
      "font-medium",
      "text-[0.6rem]",
      "text-[var(--ml-ink-primary)]",
    )
    expect(
      within(skill).getByTestId("character-skill-value"),
    ).toHaveTextContent("43")
    expect(within(skill).getByText("21")).toBeVisible()
    expect(within(skill).getByText("8")).toBeVisible()
    expect(
      within(skill).getByRole("button", {
        name: "Бросить навык Иностранный язык (1%)",
      }),
    ).toHaveClass("h-full", "w-full")
    const developmentMark = within(skill).getByLabelText("Отмечен для развития")
    expect(developmentMark).toHaveClass("cursor-pointer", "self-stretch", "w-7")
    expect(
      within(developmentMark).getByTestId("skill-development-checkbox"),
    ).toHaveClass("size-5", "rounded-[3px]")
    const actions = within(skill).getByTestId("character-skill-actions")
    expect(actions).toHaveClass("flex-col")
    expect(
      within(actions).getByRole("button", {
        name: "Редактировать навык Иностранный язык",
      }),
    ).toHaveClass(
      "size-7",
      "cursor-pointer",
      "text-[var(--ml-accent-aged-gold)]",
    )
    expect(
      within(actions).getByRole("button", {
        name: "Удалить навык Иностранный язык",
      }),
    ).toHaveClass("size-7", "text-[#f2a29e]")
  })

  it.each([null, []])("renders an empty state for %j", (skills) => {
    render(
      <CharacterSkills
        characterId="character-1"
        characteristics={{ dexterity: null, education: null }}
        skills={skills}
      />,
    )

    expect(
      screen.getByText("Навыки персонажа пока не добавлены."),
    ).toBeVisible()
  })

  it("filters skills by a case-insensitive Russian substring and clears the search", async () => {
    const user = userEvent.setup()
    render(
      <CharacterSkills
        characterId="character-1"
        characteristics={{ dexterity: null, education: null }}
        skills={[
          characterSkill({ id: "anthropology", name: "Антропология" }),
          characterSkill({ id: "archaeology", name: "Археология" }),
          characterSkill({ id: "library", name: "Библиотечное дело" }),
        ]}
      />,
    )

    const search = screen.getByRole("searchbox", { name: "Поиск навыков" })
    expect(
      screen.queryByRole("button", { name: "Очистить поиск навыков" }),
    ).not.toBeInTheDocument()

    await user.type(search, "АРХЕО")

    await waitFor(() =>
      expect(screen.getAllByTestId("character-skill-name")).toHaveLength(1),
    )
    expect(screen.getByTestId("character-skill-name")).toHaveTextContent(
      "Археология (20%)",
    )
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("А")

    await user.click(
      screen.getByRole("button", { name: "Очистить поиск навыков" }),
    )

    expect(search).toHaveValue("")
    await waitFor(() =>
      expect(screen.getAllByTestId("character-skill-name")).toHaveLength(3),
    )

    await user.type(search, "несуществующий")
    expect(await screen.findByText("Навыки не найдены.")).toBeVisible()
  })

  it("keeps protected skills from deletion while allowing their development mark", async () => {
    const user = userEvent.setup()
    render(
      <CharacterSkills
        characterId="character-1"
        characteristics={{ dexterity: 60, education: null }}
        skills={[
          characterSkill({
            base_rule: "dodge",
            id: "dodge",
            is_protected: true,
            name: "Уклонение",
            total_value: 30,
            value: 0,
          }),
        ]}
      />,
    )

    expect(
      screen.queryByLabelText("Удалить навык Уклонение"),
    ).not.toBeInTheDocument()
    await user.click(screen.getByLabelText("Не отмечен для развития"))
    expect(updateSkillMutation.mutate).toHaveBeenCalledWith({
      base_value: 20,
      checked: true,
      name: "Уклонение",
      value: 0,
    })

    await user.click(
      screen.getByRole("button", { name: "Редактировать навык Уклонение" }),
    )
    const dialog = screen.getByRole("dialog", {
      name: "Редактировать: Уклонение",
    })
    expect(
      within(dialog).queryByText("Уклонение", { selector: "p" }),
    ).not.toBeInTheDocument()
  })

  it.each([
    {
      baseRule: "dodge" as const,
      characteristics: { dexterity: null, education: 70 },
      name: "Уклонение",
      reason:
        "Сначала заполните характеристику «Ловкость»: без неё невозможно рассчитать значение навыка.",
    },
    {
      baseRule: "native_language" as const,
      characteristics: { dexterity: 60, education: null },
      name: "Язык, родной",
      reason:
        "Сначала заполните характеристику «Образование»: без неё невозможно рассчитать значение навыка.",
    },
  ])(
    "explains why the dynamic skill $name is unavailable",
    async ({ baseRule, characteristics, name, reason }) => {
      const user = userEvent.setup()
      render(
        <CharacterSkills
          characterId="character-1"
          characteristics={characteristics}
          skills={[
            characterSkill({
              base_rule: baseRule,
              id: baseRule,
              name,
            }),
          ]}
        />,
      )

      expect(screen.getByTestId("character-skill-name")).toHaveTextContent(
        `${name} (—)`,
      )
      const blockedSkill = screen.getByRole("button", {
        name: `Навык ${name} (—) недоступен. ${reason}`,
      })
      expect(blockedSkill).toHaveAttribute("aria-disabled", "true")
      expect(blockedSkill).toHaveClass("cursor-not-allowed")
      blockedSkill.focus()
      expect(blockedSkill).toHaveFocus()

      await user.hover(blockedSkill)
      expect(await screen.findByRole("tooltip")).toHaveTextContent(reason)
    },
  )

  it("clamps a skill over 100% and blocks its development mark", () => {
    render(
      <CharacterSkills
        characterId="character-1"
        characteristics={{ dexterity: null, education: null }}
        skills={[
          characterSkill({
            id: "library",
            name: "Библиотека",
            total_value: 130,
          }),
        ]}
      />,
    )

    const skill = screen.getByTestId("character-skill")
    expect(
      within(skill).getByTestId("character-skill-value"),
    ).toHaveTextContent("100")
    expect(within(skill).getByText("50")).toBeVisible()
    expect(within(skill).getByText("20")).toBeVisible()
    expect(
      within(skill).getByLabelText("Не отмечен для развития"),
    ).toBeDisabled()
  })

  it("opens the shared modal for creating and editing", async () => {
    const user = userEvent.setup()
    render(
      <CharacterSkills
        characterId="character-1"
        characteristics={{ dexterity: null, education: null }}
        skills={[characterSkill({ id: "library", name: "Библиотека" })]}
      />,
    )

    await user.click(
      screen.getByRole("button", { name: "Редактировать навык Библиотека" }),
    )
    const editDialog = screen.getByRole("dialog", {
      name: "Редактировать: Библиотека",
    })
    expect(editDialog).toBeVisible()
    expect(within(editDialog).getByTestId("character-skill-form")).toHaveClass(
      "grid",
      "gap-4",
    )
    expect(
      within(editDialog).getByTestId("character-skill-form"),
    ).not.toHaveClass("border", "bg-[var(--ml-surface-panel-raised)]/60", "p-2")
    const cancelButton = within(editDialog).getByRole("button", {
      name: "Отмена",
    })
    const saveButton = within(editDialog).getByRole("button", {
      name: "Сохранить",
    })
    expect(cancelButton).toHaveClass("w-full", "sm:flex-1")
    expect(cancelButton).toHaveAttribute("data-variant", "destructive")
    expect(saveButton).toHaveClass("w-full", "sm:flex-1")
    expect(saveButton).toHaveAttribute("data-variant", "success")
    const checkbox = within(editDialog).getByRole("checkbox", {
      name: "Отмечен для развития",
    })
    expect(checkbox).toHaveAttribute("data-slot", "checkbox")
    expect(checkbox).toHaveAttribute("aria-checked", "false")
    await user.click(checkbox)
    expect(checkbox).toHaveAttribute("aria-checked", "true")
    await user.click(
      screen.getByLabelText("Закрыть окно: Редактировать: Библиотека"),
    )

    const addButton = screen.getByRole("button", {
      name: "Добавить собственный навык",
    })
    expect(addButton).toHaveClass("cursor-pointer", "size-7")
    await user.click(addButton)
    const createDialog = screen.getByRole("dialog", {
      name: "Добавить навык",
    })
    expect(createDialog).toBeVisible()
    expect(
      within(createDialog).getByTestId("character-skill-form"),
    ).toHaveClass("grid", "gap-4")
  })

  it("normalizes an over-100 skill before saving it from the editor", async () => {
    const user = userEvent.setup()
    render(
      <CharacterSkills
        characterId="character-1"
        characteristics={{ dexterity: null, education: null }}
        skills={[
          characterSkill({
            base_value: 70,
            id: "library",
            name: "Библиотека",
            total_value: 120,
            value: 50,
          }),
        ]}
      />,
    )

    await user.click(
      screen.getByRole("button", { name: "Редактировать навык Библиотека" }),
    )

    expect(screen.getByLabelText("Базовое значение навыка")).toHaveValue(70)
    expect(screen.getByLabelText("Прокачка навыка")).toHaveValue(30)
    await user.click(screen.getByRole("button", { name: "Сохранить" }))

    await waitFor(() =>
      expect(updateSkillMutation.mutateAsync).toHaveBeenCalledWith({
        base_value: 70,
        checked: false,
        name: "Библиотека",
        value: 30,
      }),
    )
  })

  it("deletes an existing skill after confirmation", async () => {
    const user = userEvent.setup()
    render(
      <CharacterSkills
        characterId="character-1"
        characteristics={{ dexterity: null, education: null }}
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

  it("makes a normal skill check and marks a successful skill below 100%", async () => {
    const user = userEvent.setup()
    render(
      <CharacterSkills
        characterId="character-1"
        characteristics={{ dexterity: 60, education: null }}
        skills={[characterSkill({ id: "library", name: "Библиотека" })]}
      />,
    )

    await user.click(
      screen.getByRole("button", { name: "Бросить навык Библиотека (20%)" }),
    )

    await waitFor(() =>
      expect(rollMutation.mutateAsync).toHaveBeenCalledWith({
        d100Mode: "normal",
        expression: "1d100",
      }),
    )
    expect(updateSkillMutation.mutateAsync).toHaveBeenCalledWith({
      base_value: 20,
      checked: true,
      name: "Библиотека",
      value: 20,
    })
  })
})
