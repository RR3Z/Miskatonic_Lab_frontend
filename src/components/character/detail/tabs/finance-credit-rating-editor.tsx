"use client"

import { toast } from "sonner"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUpdateCharacterFinances } from "@/lib/api/use-character-finances"
import type { CharacterSkill } from "@/types/character"

export function FinanceCreditRatingEditor({
  characterId,
  currentSkill,
  skills,
}: {
  characterId: string
  currentSkill: CharacterSkill | null | undefined
  skills: CharacterSkill[] | null
}) {
  const mutation = useUpdateCharacterFinances(characterId)
  const selectableSkills =
    currentSkill &&
    !(skills ?? []).some((skill) => skill.id === currentSkill.id)
      ? [currentSkill, ...(skills ?? [])]
      : (skills ?? [])

  async function handleChange(skillId: string) {
    if (skillId === currentSkill?.id) return

    try {
      await mutation.mutateAsync({ credit_rating_skill_id: skillId })
    } catch {
      toast.error("Не удалось сохранить кредитный рейтинг")
    }
  }

  return (
    <div>
      <Select
        disabled={mutation.isPending || !selectableSkills.length}
        onValueChange={handleChange}
        value={currentSkill?.id ?? ""}
      >
        <SelectTrigger
          aria-label="Редактировать кредитный рейтинг"
          className="mt-2 w-full"
          size="lg"
          variant="inline"
        >
          <SelectValue placeholder="Выбрать навык" />
        </SelectTrigger>
        <SelectContent>
          {selectableSkills.map((skill) => (
            <SelectItem key={skill.id} value={skill.id}>
              {skill.name} — {skill.value}%
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
