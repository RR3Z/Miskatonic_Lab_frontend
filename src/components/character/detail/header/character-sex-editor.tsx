"use client"

import { useState } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const EMPTY_SEX_VALUE = "not-specified"

export function CharacterSexEditor({
  onSave,
  value,
}: {
  onSave: (sex: "female" | "male" | null) => Promise<unknown>
  value: string | null
}) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  async function handleChange(nextValue: string) {
    setError(null)
    setIsPending(true)
    try {
      await onSave(
        nextValue === EMPTY_SEX_VALUE ? null : (nextValue as "female" | "male"),
      )
    } catch {
      setError("Не удалось сохранить пол")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="flex min-w-0 items-center gap-1 font-body text-sm leading-5">
      <span className="shrink-0 text-[var(--ml-ink-muted)]">Пол:</span>{" "}
      <div className="min-w-0 flex-1">
        <Select
          disabled={isPending}
          onValueChange={handleChange}
          value={
            value === "female" || value === "male" ? value : EMPTY_SEX_VALUE
          }
        >
          <SelectTrigger
            aria-label="Редактировать пол персонажа"
            className="h-7 w-full border-transparent bg-transparent px-1.5 py-0 text-sm shadow-none hover:border-[var(--ml-border-aged)]"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={EMPTY_SEX_VALUE}>—</SelectItem>
            <SelectItem value="male">Мужчина</SelectItem>
            <SelectItem value="female">Женщина</SelectItem>
          </SelectContent>
        </Select>
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
      </div>
    </div>
  )
}
