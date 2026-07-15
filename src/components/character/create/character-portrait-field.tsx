"use client"

import { ImagePlus, X } from "lucide-react"
import { useEffect, useId, useState } from "react"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/components/ui/attachment"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  type CreateCharacterFormDto,
  type CreateCharacterFormInput,
  characterPortraitSchema,
  PORTRAIT_MIME_TYPES,
} from "@/dto/character/create-character.dto"
import { getPortraitUrl } from "@/lib/utils/portrait.util"

type CharacterPortraitFieldProps = {
  disabled: boolean
}

export function CharacterPortraitField({
  disabled,
}: CharacterPortraitFieldProps) {
  const portraitId = useId()
  const [previewURL, setPreviewURL] = useState<string | null>(null)
  const form = useFormContext<
    CreateCharacterFormInput,
    undefined,
    CreateCharacterFormDto
  >()
  const portrait = form.watch("portrait")
  const sex = form.watch("sex")
  const fallbackPortrait = getPortraitUrl(null, sex || null)

  useEffect(() => {
    if (!portrait) {
      setPreviewURL(null)
      return
    }

    const objectURL = URL.createObjectURL(portrait)
    setPreviewURL(objectURL)
    return () => URL.revokeObjectURL(objectURL)
  }, [portrait])

  function handlePortrait(file: File | null) {
    if (!file) {
      form.setValue("portrait", null, { shouldDirty: true })
      form.clearErrors("portrait")
      return
    }

    const result = characterPortraitSchema.safeParse(file)
    if (!result.success) {
      form.clearErrors("portrait")
      toast.error(
        result.error.issues[0]?.message ?? "Не удалось выбрать портрет",
        { id: "character-portrait-validation-error" },
      )
      return
    }

    form.setValue("portrait", result.data, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  return (
    <Field>
      <FieldLabel htmlFor={portraitId}>Портрет</FieldLabel>
      <Attachment
        className="w-full flex-nowrap rounded-lg border-[var(--ml-border-subtle)] bg-[var(--ml-surface-panel-raised)]"
        size="sm"
        state={portrait ? "done" : "idle"}
      >
        <AttachmentMedia
          className="w-16! rounded-md border border-[var(--ml-border-aged)]"
          variant="image"
        >
          {/* biome-ignore lint/performance/noImgElement: blob URLs need a native preview */}
          <img
            alt="Предпросмотр портрета"
            src={previewURL ?? fallbackPortrait}
          />
        </AttachmentMedia>
        <AttachmentContent className="py-1">
          <AttachmentTitle className="flex items-center gap-1.5 text-sm">
            {!portrait ? (
              <ImagePlus
                aria-hidden="true"
                className="size-4 shrink-0 text-[var(--ml-accent-aged-gold)]"
              />
            ) : null}
            {portrait?.name ?? "Выбрать портрет"}
          </AttachmentTitle>
          <AttachmentDescription>
            {portrait
              ? "Файл готов к загрузке"
              : "Нажмите, чтобы открыть файлы"}
          </AttachmentDescription>
        </AttachmentContent>
        {portrait ? (
          <AttachmentActions>
            <AttachmentAction
              aria-label="Удалить выбранный портрет"
              disabled={disabled}
              onClick={() => handlePortrait(null)}
              type="button"
              variant="destructive"
            >
              <X aria-hidden="true" />
            </AttachmentAction>
          </AttachmentActions>
        ) : null}
        <AttachmentTrigger asChild>
          <label
            aria-disabled={disabled}
            className={disabled ? "pointer-events-none" : "cursor-pointer"}
            htmlFor={portraitId}
          >
            <span className="sr-only">Выбрать изображение</span>
          </label>
        </AttachmentTrigger>
      </Attachment>
      <Input
        accept={PORTRAIT_MIME_TYPES.join(",")}
        className="sr-only"
        disabled={disabled}
        id={portraitId}
        onChange={(event) => handlePortrait(event.target.files?.[0] ?? null)}
        type="file"
      />
      <FieldDescription className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
        <span>1 файл</span>
        <span aria-hidden="true">•</span>
        <span>JPEG, PNG или WebP</span>
        <span aria-hidden="true">•</span>
        <span>до 5 МБ</span>
      </FieldDescription>
    </Field>
  )
}
