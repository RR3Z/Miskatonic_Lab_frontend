import { MAX_SKILL_TOTAL } from "@/components/character/detail/skills/constants/skill-values.constants"
import type { CharacterSkill } from "@/types/character.types"

export function clampSkillTotal(value: number) {
  return Math.min(Math.max(value, 0), MAX_SKILL_TOTAL)
}

export function getEffectiveSkillTotal(skill: CharacterSkill) {
  return clampSkillTotal(skill.total_value)
}

export function getEditableSkillValues(baseValue: number, value: number) {
  const base = clampSkillTotal(baseValue)
  return {
    baseValue: base,
    value: Math.min(Math.max(value, 0), MAX_SKILL_TOTAL - base),
  }
}
