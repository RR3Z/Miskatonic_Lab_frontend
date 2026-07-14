import type { UseFormReturn } from "react-hook-form"

import type {
  CreateCharacterNoteDto,
  CreateCharacterNoteInput,
} from "@/dto/character/create-character-note.dto"

export type CreateCharacterNoteForm = UseFormReturn<
  CreateCharacterNoteInput,
  undefined,
  CreateCharacterNoteDto
>

export type CreateCharacterNoteFormProps = {
  form: CreateCharacterNoteForm
  isPending: boolean
  onCancel: () => void
  onSubmit: (data: CreateCharacterNoteDto) => Promise<void>
}
