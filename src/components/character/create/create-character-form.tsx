"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import type { FieldErrors } from "react-hook-form"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import { CharacterIdentityFields } from "@/components/character/create/character-identity-fields"
import { CharacterPortraitField } from "@/components/character/create/character-portrait-field"
import {
  showError,
  showErrorCode,
} from "@/components/errors/utils/error-toast.util"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog/dialog-footer"
import { FieldGroup } from "@/components/ui/field/field-group"
import { Spinner } from "@/components/ui/spinner"
import localizedContent from "@/data/locales/ru/character/create.ru.json"
import {
  type CreateCharacterFormDto,
  type CreateCharacterFormInput,
  createCharacterFormDefaultValues,
  createCharacterFormSchema,
} from "@/dto/character/create-character.dto"
import { useCreateCharacter } from "@/hooks/character/use-create-character"

type CreateCharacterFormProps = {
  onCancel: () => void
  onCompleted: () => void
  onPendingChange: (pending: boolean) => void
}

export function CreateCharacterForm({
  onCancel,
  onCompleted,
  onPendingChange,
}: CreateCharacterFormProps) {
  const mutation = useCreateCharacter()
  const form = useForm<
    CreateCharacterFormInput,
    undefined,
    CreateCharacterFormDto
  >({
    defaultValues: createCharacterFormDefaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(createCharacterFormSchema),
  })
  const isPending = mutation.isPending || form.formState.isSubmitting

  useEffect(() => {
    onPendingChange(isPending)
  }, [isPending, onPendingChange])

  useEffect(
    () => () => {
      onPendingChange(false)
    },
    [onPendingChange],
  )

  async function handleSubmit(data: CreateCharacterFormDto) {
    try {
      const result = await mutation.mutateAsync(data)

      if (result.portraitStatus === "failed") {
        toast.warning(
          localizedContent.copy.componentsCharacterCreateCreateCharacterForm
            .personazhSozdanNoPortretZagruzitNe,
        )
      }

      onCompleted()
    } catch (error) {
      await showError(error, "character-create-error")
    }
  }

  function handleInvalid(errors: FieldErrors<CreateCharacterFormInput>) {
    const error = errors.name ?? errors.sex ?? errors.age ?? errors.portrait
    void error
    showErrorCode(
      "client.validation_failed",
      "character-create-validation-error",
    )
  }

  return (
    <FormProvider {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(handleSubmit, handleInvalid)}
      >
        <FieldGroup className="gap-4">
          <CharacterPortraitField disabled={isPending} />
          <CharacterIdentityFields disabled={isPending} />
        </FieldGroup>

        <DialogFooter className="mt-5 sm:justify-stretch">
          <Button
            className="w-full sm:flex-1"
            disabled={isPending}
            onClick={onCancel}
            type="button"
            variant="destructive"
          >
            {
              localizedContent.copy.componentsCharacterCreateCreateCharacterForm
                .otmena
            }
          </Button>
          <Button
            className="w-full sm:flex-1"
            disabled={isPending}
            type="submit"
            variant="success"
          >
            {isPending ? (
              <>
                <Spinner aria-hidden="true" data-icon="inline-start" />
                {
                  localizedContent.copy
                    .componentsCharacterCreateCreateCharacterForm.sozdanie
                }
              </>
            ) : (
              localizedContent.copy.componentsCharacterCreateCreateCharacterForm
                .sozdatPersonazha
            )}
          </Button>
        </DialogFooter>
      </form>
    </FormProvider>
  )
}
