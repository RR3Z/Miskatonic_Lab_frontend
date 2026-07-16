"use client"

import { X } from "lucide-react"

import { CharacterSkillForm } from "@/components/character/detail/skills/character-skill-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { CharacterSkillInput } from "@/lib/api/character-skills"

export function CharacterSkillEditorDialog({
  canEditDefinition = true,
  initialValue,
  isPending,
  onOpenChange,
  onSubmit,
  open,
  title,
}: {
  canEditDefinition?: boolean
  initialValue: CharacterSkillInput
  isPending: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: CharacterSkillInput) => Promise<unknown>
  open: boolean
  title: string
}) {
  function closeDialog() {
    if (!isPending) onOpenChange(false)
  }

  return (
    <Dialog
      onOpenChange={(nextOpen) => {
        if (!isPending) onOpenChange(nextOpen)
      }}
      open={open}
    >
      <DialogContent
        className="max-h-[calc(100dvh-2rem)] overflow-x-hidden overflow-y-auto border border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel)] text-[var(--ml-ink-primary)] shadow-2xl sm:max-w-md"
        showCloseButton={false}
      >
        <DialogHeader className="items-center border-b border-[var(--ml-border-subtle)] pb-3 text-center">
          <DialogTitle className="font-heading text-xl font-semibold tracking-wide">
            {title}
          </DialogTitle>
        </DialogHeader>
        <DialogClose asChild>
          <Button
            aria-label={`Закрыть окно: ${title}`}
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
        <CharacterSkillForm
          canEditDefinition={canEditDefinition}
          initialValue={initialValue}
          isPending={isPending}
          onCancel={closeDialog}
          onSubmit={async (input) => {
            await onSubmit(input)
            onOpenChange(false)
          }}
          submitLabel="Сохранить"
        />
      </DialogContent>
    </Dialog>
  )
}
