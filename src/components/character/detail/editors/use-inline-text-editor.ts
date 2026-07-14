"use client"

import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import type { ZodType } from "zod"

type InlineTextForm = {
  value: string
}

export function useInlineTextEditor({
  errorMessage,
  onSave,
  schema,
  value,
}: {
  errorMessage: string
  onSave: (value: string) => Promise<unknown>
  schema: ZodType<string>
  value: string | null
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const saveLock = useRef(false)
  const form = useForm<InlineTextForm>({
    defaultValues: { value: value ?? "" },
  })

  useEffect(() => {
    if (!isEditing) form.reset({ value: value ?? "" })
  }, [form, isEditing, value])

  function startEditing() {
    form.reset({ value: value ?? "" })
    setIsEditing(true)
  }

  function cancelEditing() {
    form.reset({ value: value ?? "" })
    setIsEditing(false)
  }

  async function save() {
    if (saveLock.current) return

    const parsed = schema.safeParse(form.getValues("value"))
    if (!parsed.success) {
      form.setError("value", { message: parsed.error.issues[0]?.message })
      return
    }

    if (parsed.data === (value ?? "")) {
      setIsEditing(false)
      return
    }

    saveLock.current = true
    setIsPending(true)
    try {
      await onSave(parsed.data)
      setIsEditing(false)
    } catch {
      form.setError("value", { message: errorMessage })
    } finally {
      saveLock.current = false
      setIsPending(false)
    }
  }

  function submit() {
    void save()
  }

  return {
    cancelEditing,
    form,
    isEditing,
    isPending,
    startEditing,
    submit,
  }
}
