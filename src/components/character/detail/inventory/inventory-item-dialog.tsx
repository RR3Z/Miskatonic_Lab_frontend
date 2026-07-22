"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"
import { useId } from "react"
import type { FieldErrors } from "react-hook-form"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog/dialog"
import { DialogClose } from "@/components/ui/dialog/dialog-close"
import { DialogContent } from "@/components/ui/dialog/dialog-content"
import { DialogFooter } from "@/components/ui/dialog/dialog-footer"
import { DialogHeader } from "@/components/ui/dialog/dialog-header"
import { DialogTitle } from "@/components/ui/dialog/dialog-title"
import { Field } from "@/components/ui/field/field"
import { FieldLabel } from "@/components/ui/field/field-label"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"
import { formatLocalizedTemplate } from "@/data/locales/utils/format-localized-template.util"
import {
  type CharacterInventoryItemDto,
  type CharacterInventoryItemInput,
  characterInventoryItemDefaultValues,
  characterInventoryItemSchema,
  MAX_CHARACTER_INVENTORY_ITEM_CATEGORY_LENGTH,
  MAX_CHARACTER_INVENTORY_ITEM_NAME_LENGTH,
} from "@/dto/character/character-inventory-item.dto"
import { useCreateCharacterInventoryItem } from "@/hooks/character/use-create-character-inventory-item"
import { useUpdateCharacterInventoryItem } from "@/hooks/character/use-update-character-inventory-item"
import type { CharacterInventoryItem } from "@/types/character.types"

export function InventoryItemDialog({
  categorySuggestions,
  characterId,
  item,
  onOpenChange,
  open,
}: {
  categorySuggestions: string[]
  characterId: string
  item?: CharacterInventoryItem
  onOpenChange: (open: boolean) => void
  open: boolean
}) {
  const nameId = useId()
  const quantityId = useId()
  const categoryId = useId()
  const categoryListId = useId()
  const descriptionId = useId()
  const createMutation = useCreateCharacterInventoryItem(characterId)
  const updateMutation = useUpdateCharacterInventoryItem(
    characterId,
    item?.id ?? "",
  )
  const form = useForm<
    CharacterInventoryItemInput,
    undefined,
    CharacterInventoryItemDto
  >({
    defaultValues: item
      ? {
          category: item.category ?? "",
          description: item.description ?? "",
          name: item.name,
          quantity: item.quantity?.toString() ?? "",
        }
      : characterInventoryItemDefaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(characterInventoryItemSchema),
  })
  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    form.formState.isSubmitting
  const dialogTitle = item
    ? localizedContent.copy.characterDetailInventoryInventoryItemDialog
        .redaktirovatPredmet
    : localizedContent.copy.characterDetailInventoryInventoryItemDialog
        .novyiPredmet

  function closeDialog() {
    if (isPending) return
    form.reset()
    onOpenChange(false)
  }

  function handleInvalid(errors: FieldErrors<CharacterInventoryItemInput>) {
    const error = errors.name ?? errors.quantity ?? errors.category
    toast.error(
      error?.message ??
        localizedContent.copy.characterDetailInventoryInventoryItemDialog
          .proverteDannyePredmeta,
      {
        id: "character-inventory-validation-error",
      },
    )
  }

  async function handleSubmit(data: CharacterInventoryItemDto) {
    try {
      if (item) await updateMutation.mutateAsync(data)
      else await createMutation.mutateAsync(data)
      toast.success(
        item
          ? localizedContent.copy.characterDetailInventoryInventoryItemDialog
              .predmetSohranen
          : localizedContent.copy.characterDetailInventoryInventoryItemDialog
              .predmetDobavlen,
      )
      closeDialog()
    } catch {
      toast.error(
        item
          ? localizedContent.copy.characterDetailInventoryInventoryItemDialog
              .neUdalosSohranitPredmetPoprobuiteEsche
          : localizedContent.copy.characterDetailInventoryInventoryItemDialog
              .neUdalosDobavitPredmetPoprobuiteEsche,
        { id: "character-inventory-save-error" },
      )
    }
  }

  return (
    <Dialog
      onOpenChange={(nextOpen) => {
        if (nextOpen) onOpenChange(true)
        else closeDialog()
      }}
      open={open}
    >
      <DialogContent
        className="max-h-[calc(100dvh-2rem)] overflow-x-hidden overflow-y-auto border border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel)] text-[var(--ml-ink-primary)] shadow-2xl sm:max-w-md"
        showCloseButton={false}
      >
        <DialogHeader className="items-center border-b border-[var(--ml-border-subtle)] pb-3 text-center">
          <DialogTitle className="font-heading text-xl font-semibold tracking-wide">
            {dialogTitle}
          </DialogTitle>
        </DialogHeader>
        <DialogClose asChild>
          <Button
            aria-label={formatLocalizedTemplate(
              localizedContent.copy.characterDetailInventoryInventoryItemDialog
                .zakrytOknoValue0,
              { value0: dialogTitle },
            )}
            className="absolute top-2 right-2"
            disabled={isPending}
            onClick={closeDialog}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <X aria-hidden="true" />
          </Button>
        </DialogClose>

        <form
          className="grid gap-4"
          noValidate
          onSubmit={form.handleSubmit(handleSubmit, handleInvalid)}
        >
          <div className="grid gap-3">
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={nameId}>
                    {
                      localizedContent.copy
                        .characterDetailInventoryInventoryItemDialog.nazvanie
                    }
                  </FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    className="font-heading text-base font-semibold"
                    disabled={isPending}
                    id={nameId}
                    maxLength={MAX_CHARACTER_INVENTORY_ITEM_NAME_LENGTH}
                    placeholder={
                      localizedContent.copy
                        .characterDetailInventoryInventoryItemDialog
                        .karmannyiFonar
                    }
                    required
                  />
                </Field>
              )}
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="quantity"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={quantityId}>
                      {
                        localizedContent.copy
                          .characterDetailInventoryInventoryItemDialog
                          .kolichestvo
                      }
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      disabled={isPending}
                      id={quantityId}
                      inputMode="numeric"
                      min={1}
                      placeholder={
                        localizedContent.copy.characterDetailCommon.quantityOne
                      }
                      type="number"
                    />
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="category"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={categoryId}>
                      {
                        localizedContent.copy
                          .characterDetailInventoryInventoryItemDialog
                          .kategoriya
                      }
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      disabled={isPending}
                      id={categoryId}
                      list={categoryListId}
                      maxLength={MAX_CHARACTER_INVENTORY_ITEM_CATEGORY_LENGTH}
                      placeholder={
                        localizedContent.copy
                          .characterDetailInventoryInventoryItemDialog
                          .snaryazhenie
                      }
                    />
                  </Field>
                )}
              />
            </div>
            <datalist id={categoryListId}>
              {categorySuggestions.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={descriptionId}>
                    {
                      localizedContent.copy
                        .characterDetailInventoryInventoryItemDialog.opisanie
                    }
                  </FieldLabel>
                  <Textarea
                    {...field}
                    aria-invalid={fieldState.invalid}
                    className="min-h-24 py-2 text-sm leading-6"
                    disabled={isPending}
                    id={descriptionId}
                    placeholder={
                      localizedContent.copy
                        .characterDetailInventoryInventoryItemDialog
                        .chtoVazhnoZnatObEtomPredmete
                    }
                  />
                </Field>
              )}
            />
          </div>

          <DialogFooter>
            <Button
              className="w-full sm:flex-1"
              disabled={isPending}
              onClick={closeDialog}
              type="button"
              variant="secondary"
            >
              {
                localizedContent.copy
                  .characterDetailInventoryInventoryItemDialog.otmena
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
                      .characterDetailInventoryInventoryItemDialog.sohranenie
                  }
                </>
              ) : item ? (
                localizedContent.copy
                  .characterDetailInventoryInventoryItemDialog.sohranit
              ) : (
                localizedContent.copy
                  .characterDetailInventoryInventoryItemDialog.dobavit
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
