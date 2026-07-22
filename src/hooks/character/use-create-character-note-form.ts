"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"

import type {
  CreateCharacterNoteDto,
  CreateCharacterNoteInput,
} from "@/dto/character/create-character-note.dto"
import {
  createCharacterNoteDefaultValues,
  createCharacterNoteSchema,
} from "@/dto/character/create-character-note.dto"
import { useCreateCharacterNote } from "@/hooks/character/use-create-character-note"

export function useCreateCharacterNoteForm({
  characterId,
  onCreated,
}: {
  characterId: string
  onCreated: () => void
}) {
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

  async function handleSubmit(data: CreateCharacterNoteDto) {
    try {
      await mutation.mutateAsync(data)
      toast.success(
        localizedContent.copy.hooksCharacterUseCreateCharacterNoteForm
          .zametkaDobavlena,
      )
      form.reset()
      onCreated()
    } catch {
      toast.error(
        localizedContent.copy.hooksCharacterUseCreateCharacterNoteForm
          .neUdalosDobavitZametkuPoprobuiteEsche,
        {
          id: "character-note-create-error",
        },
      )
    }
  }

  return { form, handleSubmit, isPending }
}
