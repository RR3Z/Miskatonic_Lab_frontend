"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { HTTPError } from "ky"
import { ImagePlus, X } from "lucide-react"
import { useEffect, useId, useState } from "react"
import { Controller, useForm } from "react-hook-form"
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
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import {
  type CreateCharacterFormDto,
  type CreateCharacterFormInput,
  characterPortraitSchema,
  createCharacterFormDefaultValues,
  createCharacterFormSchema,
  MAX_CHARACTER_NAME_LENGTH,
  PORTRAIT_MIME_TYPES,
} from "@/dto/character/create-character.dto"
import {
  CharacterPortraitUploadError,
  useCreateCharacter,
} from "@/lib/api/use-characters"
import { getPortraitUrl } from "@/lib/utils/portrait.util"

type CreateCharacterModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateCharacterModal({
  open,
  onOpenChange,
}: CreateCharacterModalProps) {
  const mutation = useCreateCharacter()
  const nameId = useId()
  const sexId = useId()
  const ageId = useId()
  const portraitId = useId()
  const [previewURL, setPreviewURL] = useState<string | null>(null)
  const form = useForm<
    CreateCharacterFormInput,
    undefined,
    CreateCharacterFormDto
  >({
    resolver: zodResolver(createCharacterFormSchema),
    defaultValues: createCharacterFormDefaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  })
  const portrait = form.watch("portrait")
  const sex = form.watch("sex")

  useEffect(() => {
    if (!portrait) {
      setPreviewURL(null)
      return
    }
    const objectURL = URL.createObjectURL(portrait)
    setPreviewURL(objectURL)
    return () => URL.revokeObjectURL(objectURL)
  }, [portrait])

  function resetForm() {
    form.reset(createCharacterFormDefaultValues)
  }

  async function handleSubmit(data: CreateCharacterFormDto) {
    try {
      await mutation.mutateAsync(data)
      toast.success("Персонаж создан")
      resetForm()
      onOpenChange(false)
    } catch (error) {
      if (error instanceof CharacterPortraitUploadError) {
        toast.warning("Персонаж создан, но портрет загрузить не удалось")
        resetForm()
        onOpenChange(false)
        return
      }

      const code = await getApiErrorCode(error)
      toast.error(
        code === "character.limit_reached"
          ? "Достигнут лимит персонажей"
          : "Не удалось создать персонажа. Проверьте данные и попробуйте ещё раз.",
        { id: "character-create-error" },
      )
    }
  }

  function handlePortrait(file: File | null) {
    if (!file) {
      form.setValue("portrait", null, { shouldDirty: true })
      form.clearErrors("portrait")
      return
    }

    const result = characterPortraitSchema.safeParse(file)
    if (!result.success) {
      form.setError("portrait", {
        type: "validate",
        message: result.error.issues[0]?.message,
      })
      return
    }

    form.setValue("portrait", result.data, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  const portraitError = form.formState.errors.portrait
  const isPending = mutation.isPending || form.formState.isSubmitting
  const fallbackPortrait = getPortraitUrl(null, sex || null)

  return (
    <Dialog
      onOpenChange={(nextOpen) => {
        if (isPending) return
        if (!nextOpen) resetForm()
        onOpenChange(nextOpen)
      }}
      open={open}
    >
      <DialogContent
        className="max-h-[92dvh] overflow-y-auto border border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel)] text-[var(--ml-ink-primary)] shadow-2xl sm:max-w-[34rem]"
        onInteractOutside={(event) => event.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader className="pr-9">
          <DialogTitle className="text-2xl">Новый персонаж</DialogTitle>
          <DialogDescription className="sr-only">
            Форма создания нового персонажа
          </DialogDescription>
        </DialogHeader>
        <DialogClose asChild>
          <Button
            aria-label="Закрыть окно создания персонажа"
            className="absolute top-2 right-2"
            disabled={isPending}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <X aria-hidden="true" />
          </Button>
        </DialogClose>

        <form noValidate onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup className="gap-4">
            <Field data-invalid={Boolean(portraitError)}>
              <FieldLabel htmlFor={portraitId}>Портрет</FieldLabel>
              <Attachment
                className="w-full flex-nowrap rounded-lg border-[var(--ml-border-subtle)] bg-[var(--ml-surface-panel-raised)]"
                size="sm"
                state={portraitError ? "error" : portrait ? "done" : "idle"}
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
                      disabled={isPending}
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
                    aria-disabled={isPending}
                    className={
                      isPending ? "pointer-events-none" : "cursor-pointer"
                    }
                    htmlFor={portraitId}
                  >
                    <span className="sr-only">Выбрать изображение</span>
                  </label>
                </AttachmentTrigger>
              </Attachment>
              <Input
                accept={PORTRAIT_MIME_TYPES.join(",")}
                className="sr-only"
                disabled={isPending}
                id={portraitId}
                onChange={(event) =>
                  handlePortrait(event.target.files?.[0] ?? null)
                }
                type="file"
              />
              <FieldDescription className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
                <span>1 файл</span>
                <span aria-hidden="true">•</span>
                <span>JPEG, PNG или WebP</span>
                <span aria-hidden="true">•</span>
                <span>до 5 МБ</span>
              </FieldDescription>
              <FieldError errors={[portraitError]} />
            </Field>

            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={nameId}>Имя</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    className="bg-[var(--ml-surface-panel-raised)]"
                    disabled={isPending}
                    id={nameId}
                    maxLength={MAX_CHARACTER_NAME_LENGTH}
                    placeholder="Например, Харви Уолтерс"
                    required
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="sex"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={sexId}>Пол</FieldLabel>
                    <Select
                      disabled={isPending}
                      name={field.name}
                      onValueChange={(value) =>
                        field.onChange(value === "unspecified" ? "" : value)
                      }
                      value={field.value || "unspecified"}
                    >
                      <SelectTrigger
                        aria-invalid={fieldState.invalid}
                        className="w-full bg-[var(--ml-surface-panel-raised)]"
                        id={sexId}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unspecified">Не указан</SelectItem>
                        <SelectItem value="male">Мужчина</SelectItem>
                        <SelectItem value="female">Женщина</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="age"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={ageId}>Возраст</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      className="bg-[var(--ml-surface-panel-raised)]"
                      disabled={isPending}
                      id={ageId}
                      min={0}
                      placeholder="Например, 42"
                      type="number"
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </div>
          </FieldGroup>

          <DialogFooter className="mt-5 sm:justify-stretch">
            <DialogClose asChild>
              <Button
                className="w-full sm:flex-1"
                disabled={isPending}
                type="button"
                variant="destructive"
              >
                Отмена
              </Button>
            </DialogClose>
            <Button
              className="w-full sm:flex-1"
              disabled={isPending}
              type="submit"
              variant="success"
            >
              {isPending ? (
                <>
                  <Spinner aria-hidden="true" data-icon="inline-start" />
                  Создание…
                </>
              ) : (
                "Создать персонажа"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

async function getApiErrorCode(error: unknown): Promise<string | null> {
  if (!(error instanceof HTTPError)) return null
  try {
    const body = (await error.response.clone().json()) as { code?: string }
    return body.code ?? null
  } catch {
    return null
  }
}
