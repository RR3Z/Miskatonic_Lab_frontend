"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"
import { useId } from "react"
import type { FieldErrors } from "react-hook-form"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import {
  type CharacterInventoryItemDto,
  type CharacterInventoryItemInput,
  characterInventoryItemDefaultValues,
  characterInventoryItemSchema,
  MAX_CHARACTER_INVENTORY_ITEM_CATEGORY_LENGTH,
  MAX_CHARACTER_INVENTORY_ITEM_NAME_LENGTH,
} from "@/dto/character/character-inventory-item.dto"
import {
  useCreateCharacterInventoryItem,
  useUpdateCharacterInventoryItem,
} from "@/lib/api/use-character-inventory"
import type { CharacterInventoryItem } from "@/types/character"

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
  const dialogTitle = item ? "Редактировать предмет" : "Новый предмет"

  function closeDialog() {
    if (isPending) return
    form.reset()
    onOpenChange(false)
  }

  function handleInvalid(errors: FieldErrors<CharacterInventoryItemInput>) {
    const error = errors.name ?? errors.quantity ?? errors.category
    toast.error(error?.message ?? "Проверьте данные предмета", {
      id: "character-inventory-validation-error",
    })
  }

  async function handleSubmit(data: CharacterInventoryItemDto) {
    try {
      if (item) await updateMutation.mutateAsync(data)
      else await createMutation.mutateAsync(data)
      toast.success(item ? "Предмет сохранён" : "Предмет добавлен")
      closeDialog()
    } catch {
      toast.error(
        item
          ? "Не удалось сохранить предмет. Попробуйте ещё раз."
          : "Не удалось добавить предмет. Попробуйте ещё раз.",
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
            aria-label={`Закрыть окно: ${dialogTitle}`}
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
                  <FieldLabel htmlFor={nameId}>Название</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    className="font-heading text-base font-semibold"
                    disabled={isPending}
                    id={nameId}
                    maxLength={MAX_CHARACTER_INVENTORY_ITEM_NAME_LENGTH}
                    placeholder="Карманный фонарь"
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
                    <FieldLabel htmlFor={quantityId}>Количество</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      disabled={isPending}
                      id={quantityId}
                      inputMode="numeric"
                      min={1}
                      placeholder="1"
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
                    <FieldLabel htmlFor={categoryId}>Категория</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      disabled={isPending}
                      id={categoryId}
                      list={categoryListId}
                      maxLength={MAX_CHARACTER_INVENTORY_ITEM_CATEGORY_LENGTH}
                      placeholder="Снаряжение"
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
                  <FieldLabel htmlFor={descriptionId}>Описание</FieldLabel>
                  <Textarea
                    {...field}
                    aria-invalid={fieldState.invalid}
                    className="min-h-24 py-2 text-sm leading-6"
                    disabled={isPending}
                    id={descriptionId}
                    placeholder="Что важно знать об этом предмете?"
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
              Отмена
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
                  Сохранение…
                </>
              ) : item ? (
                "Сохранить"
              ) : (
                "Добавить"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
