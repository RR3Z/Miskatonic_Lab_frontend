import type { CharacterStateTone } from "@/components/character/detail/header/types/character-state.types"

export const CHARACTER_STATE_ACTIVE_CLASSES: Record<
  CharacterStateTone,
  string
> = {
  danger:
    "border-[var(--ml-accent-danger)] bg-[var(--ml-accent-danger)]/20 text-[#d46a72]",
  sanity: "border-[#3d4f8b] bg-[#3d4f8b]/20 text-[#7f91d6]",
  warning:
    "border-[var(--ml-accent-warning)] bg-[var(--ml-accent-warning)]/15 text-[var(--ml-accent-warning)]",
}
