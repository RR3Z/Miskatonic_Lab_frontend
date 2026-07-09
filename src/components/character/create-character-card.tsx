"use client"

import { SignInButton, useUser } from "@clerk/nextjs"
import { Plus } from "lucide-react"

const cardClassName =
  "flex min-h-40 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[var(--ml-border-subtle)] bg-transparent p-6 transition"

export function CreateCharacterCard() {
  const { isSignedIn } = useUser()

  if (isSignedIn) {
    return (
      <button
        className={`${cardClassName} cursor-not-allowed opacity-40`}
        disabled
        type="button"
      >
        <Plus className="size-8 text-[var(--ml-ink-muted)]" />
        <span className="font-body text-sm text-[var(--ml-ink-muted)]">
          Создание персонажа — скоро
        </span>
      </button>
    )
  }

  return (
    <SignInButton mode="modal">
      <button
        className={`${cardClassName} cursor-pointer hover:border-[var(--ml-border-aged)] hover:bg-[var(--ml-surface-panel)]`}
        type="button"
      >
        <Plus className="size-8 text-[var(--ml-ink-muted)]" />
        <span className="font-body text-sm text-[var(--ml-ink-muted)]">
          Создать нового сыщика
        </span>
      </button>
    </SignInButton>
  )
}
