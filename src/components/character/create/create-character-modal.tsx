"use client"

import { X } from "lucide-react"
import { useState } from "react"
import { CreateCharacterForm } from "@/components/character/create/create-character-form"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog/dialog"
import { DialogClose } from "@/components/ui/dialog/dialog-close"
import { DialogContent } from "@/components/ui/dialog/dialog-content"
import { DialogDescription } from "@/components/ui/dialog/dialog-description"
import { DialogHeader } from "@/components/ui/dialog/dialog-header"
import { DialogTitle } from "@/components/ui/dialog/dialog-title"
import localizedContent from "@/data/locales/ru/character/create.ru.json"

type CreateCharacterModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateCharacterModal({
  open,
  onOpenChange,
}: CreateCharacterModalProps) {
  const [isPending, setIsPending] = useState(false)

  function closeModal() {
    if (!isPending) onOpenChange(false)
  }

  return (
    <Dialog
      onOpenChange={(nextOpen) => {
        if (isPending) return
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
          <DialogTitle className="text-2xl">
            {
              localizedContent.copy
                .componentsCharacterCreateCreateCharacterModal.novyiPersonazh
            }
          </DialogTitle>
          <DialogDescription className="sr-only">
            {
              localizedContent.copy
                .componentsCharacterCreateCreateCharacterModal
                .formaSozdaniyaNovogoPersonazha
            }
          </DialogDescription>
        </DialogHeader>
        <DialogClose asChild>
          <Button
            aria-label={
              localizedContent.copy
                .componentsCharacterCreateCreateCharacterModal
                .zakrytOknoSozdaniyaPersonazha
            }
            className="absolute top-2 right-2"
            disabled={isPending}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <X aria-hidden="true" />
          </Button>
        </DialogClose>

        <CreateCharacterForm
          onCancel={closeModal}
          onCompleted={() => onOpenChange(false)}
          onPendingChange={setIsPending}
        />
      </DialogContent>
    </Dialog>
  )
}
