"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import type {
  CreateCharacterNoteDto,
  CreateCharacterNoteInput,
} from "@/dto/character/create-character-note.dto"
import {
  createCharacterNoteDefaultValues,
  createCharacterNoteSchema,
} from "@/dto/character/create-character-note.dto"
import { useCreateCharacterNote } from "@/lib/api/use-characters"

export function useCreateCharacterNoteDialog(characterId: string) {
  const [open, setOpen] = useState(false)
  const mutation = useCreateCharacterNote(characterId)
  const form = useForm<
    CreateCharacterNoteInput,
    undefined,
    CreateCharacterNoteDto
  >({
    defaultValues: createCharacterNoteDefaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(createCharacterNoteSchema),
  })
  const isPending = mutation.isPending || form.formState.isSubmitting

  function handleOpenChange(nextOpen: boolean) {
    if (isPending) return
    setOpen(nextOpen)
    if (!nextOpen) {
      form.reset()
      mutation.reset()
    }
  }

  async function handleSubmit(data: CreateCharacterNoteDto) {
    try {
      await mutation.mutateAsync(data)
      toast.success("Заметка добавлена")
      form.reset()
      setOpen(false)
    } catch {
      toast.error("Не удалось добавить заметку. Попробуйте ещё раз.", {
        id: "character-note-create-error",
      })
    }
  }

  return {
    form,
    handleOpenChange,
    handleSubmit,
    isPending,
    open,
  }
}
