"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Select } from "@/components/ui/select/select"
import { SelectContent } from "@/components/ui/select/select-content"
import { SelectItem } from "@/components/ui/select/select-item"
import { SelectTrigger } from "@/components/ui/select/select-trigger"
import { SelectValue } from "@/components/ui/select/select-value"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"

const EMPTY_SEX_VALUE = "not-specified"

export function CharacterSexEditor({
  onSave,
  value,
}: {
  onSave: (sex: "female" | "male" | null) => Promise<unknown>
  value: string | null
}) {
  const [isPending, setIsPending] = useState(false)

  async function handleChange(nextValue: string) {
    setIsPending(true)
    try {
      await onSave(
        nextValue === EMPTY_SEX_VALUE ? null : (nextValue as "female" | "male"),
      )
    } catch {
      toast.error(
        localizedContent.copy.characterDetailHeaderCharacterSexEditor
          .neUdalosSohranitPol,
      )
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="flex min-w-0 items-center gap-1 font-body text-sm leading-5">
      <span className="shrink-0 text-[var(--ml-ink-muted)]">
        {localizedContent.copy.characterDetailHeaderCharacterSexEditor.pol}
      </span>
      <div className="min-w-0 flex-1">
        <Select
          disabled={isPending}
          onValueChange={handleChange}
          value={
            value === "female" || value === "male" ? value : EMPTY_SEX_VALUE
          }
        >
          <SelectTrigger
            aria-label={
              localizedContent.copy.characterDetailHeaderCharacterSexEditor
                .redaktirovatPolPersonazha
            }
            className="w-full"
            size="xs"
            variant="inline"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={EMPTY_SEX_VALUE}>—</SelectItem>
            <SelectItem value="male">
              {
                localizedContent.copy.characterDetailHeaderCharacterSexEditor
                  .muzhchina
              }
            </SelectItem>
            <SelectItem value="female">
              {
                localizedContent.copy.characterDetailHeaderCharacterSexEditor
                  .zhenschina
              }
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
