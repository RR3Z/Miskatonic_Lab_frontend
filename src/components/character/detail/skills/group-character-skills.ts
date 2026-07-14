import type { CharacterSkill } from "@/types/character"

export type CharacterSkillGroup = {
  initial: string
  skills: CharacterSkill[]
}

const skillCollator = new Intl.Collator("ru-RU", {
  numeric: true,
  sensitivity: "base",
})

function getSkillInitial(name: string) {
  const initial = Array.from(name.trim())[0]
  return initial ? initial.toLocaleUpperCase("ru-RU") : "#"
}

export function groupCharacterSkills(
  skills: CharacterSkill[],
): CharacterSkillGroup[] {
  const groups = new Map<string, CharacterSkill[]>()
  const sortedSkills = [...skills].sort((left, right) =>
    skillCollator.compare(left.name, right.name),
  )

  for (const skill of sortedSkills) {
    const initial = getSkillInitial(skill.name)
    const group = groups.get(initial)

    if (group) group.push(skill)
    else groups.set(initial, [skill])
  }

  return [...groups]
    .sort(([left], [right]) => skillCollator.compare(left, right))
    .map(([initial, groupedSkills]) => ({
      initial,
      skills: groupedSkills,
    }))
}
