"use client"

import { ImagePlus, X } from "lucide-react"
import { useEffect, useId, useState } from "react"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"
import { Attachment } from "@/components/ui/attachment/attachment"
import { AttachmentAction } from "@/components/ui/attachment/attachment-action"
import { AttachmentActions } from "@/components/ui/attachment/attachment-actions"
import { AttachmentContent } from "@/components/ui/attachment/attachment-content"
import { AttachmentDescription } from "@/components/ui/attachment/attachment-description"
import { AttachmentMedia } from "@/components/ui/attachment/attachment-media"
import { AttachmentTitle } from "@/components/ui/attachment/attachment-title"
import { AttachmentTrigger } from "@/components/ui/attachment/attachment-trigger"
import { Field } from "@/components/ui/field/field"
import { FieldDescription } from "@/components/ui/field/field-description"
import { FieldLabel } from "@/components/ui/field/field-label"
import { Input } from "@/components/ui/input"
import localizedContent from "@/data/locales/ru/character/create.ru.json"
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
        result.error.issues[0]?.message ??
          localizedContent.copy.componentsCharacterCreateCharacterPortraitField
            .neUdalosVybratPortret,
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
      <FieldLabel htmlFor={portraitId}>
        {
          localizedContent.copy.componentsCharacterCreateCharacterPortraitField
            .portret
        }
      </FieldLabel>
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
            alt={
              localizedContent.copy
                .componentsCharacterCreateCharacterPortraitField
                .predprosmotrPortreta
            }
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
            {portrait?.name ??
              localizedContent.copy
                .componentsCharacterCreateCharacterPortraitField.vybratPortret}
          </AttachmentTitle>
          <AttachmentDescription>
            {portrait
              ? localizedContent.copy
                  .componentsCharacterCreateCharacterPortraitField
                  .failGotovKZagruzke
              : localizedContent.copy
                  .componentsCharacterCreateCharacterPortraitField
                  .nazhmiteChtobyOtkrytFaily}
          </AttachmentDescription>
        </AttachmentContent>
        {portrait ? (
          <AttachmentActions>
            <AttachmentAction
              aria-label={
                localizedContent.copy
                  .componentsCharacterCreateCharacterPortraitField
                  .udalitVybrannyiPortret
              }
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
            <span className="sr-only">
              {
                localizedContent.copy
                  .componentsCharacterCreateCharacterPortraitField
                  .vybratIzobrazhenie
              }
            </span>
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
        <span>
          {
            localizedContent.copy
              .componentsCharacterCreateCharacterPortraitField.copy1Fail
          }
        </span>
        <span aria-hidden="true">•</span>
        <span>
          {
            localizedContent.copy
              .componentsCharacterCreateCharacterPortraitField.jpegPngIliWebp
          }
        </span>
        <span aria-hidden="true">•</span>
        <span>
          {
            localizedContent.copy
              .componentsCharacterCreateCharacterPortraitField.do5Mb
          }
        </span>
      </FieldDescription>
    </Field>
  )
}
