"use client"

import { Camera } from "lucide-react"
import Image from "next/image"
import { useId } from "react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"
import { characterPortraitSchema } from "@/dto/character/create-character.dto"
import { useUpdateCharacterPortrait } from "@/hooks/character/use-update-character-portrait"

export function CharacterPortraitEditor({
  alt,
  characterId,
  portraitUrl,
}: {
  alt: string
  characterId: string
  portraitUrl: string
}) {
  const inputId = useId()
  const mutation = useUpdateCharacterPortrait(characterId)

  async function handleFile(file: File | undefined) {
    if (!file) return
    const parsed = characterPortraitSchema.safeParse(file)
    if (!parsed.success) {
      toast.error(
        parsed.error.issues[0]?.message ??
          localizedContent.copy.characterDetailHeaderCharacterPortraitEditor
            .nekorrektnyiPortret,
      )
      return
    }
    if (!parsed.data) return

    try {
      await mutation.mutateAsync(parsed.data)
    } catch {
      toast.error(
        localizedContent.copy.characterDetailHeaderCharacterPortraitEditor
          .neUdalosObnovitPortret,
      )
    }
  }

  return (
    <div className="group/portrait relative size-24 shrink-0 overflow-hidden rounded-sm border border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel-raised)]">
      <Image
        alt={alt}
        className="object-cover"
        fill
        loading="eager"
        sizes="96px"
        src={portraitUrl}
        unoptimized={!portraitUrl.startsWith("/")}
      />
      <label
        aria-label={
          localizedContent.copy.characterDetailHeaderCharacterPortraitEditor
            .izmenitPortretPersonazha
        }
        className="absolute inset-0 grid cursor-pointer place-items-center bg-black/55 opacity-0 transition-opacity group-hover/portrait:opacity-100 focus-within:opacity-100"
        htmlFor={inputId}
      >
        <Camera aria-hidden="true" className="size-6 text-white" />
        <Input
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          disabled={mutation.isPending}
          id={inputId}
          onChange={(event) => {
            void handleFile(event.target.files?.[0])
            event.target.value = ""
          }}
          type="file"
        />
      </label>
    </div>
  )
}
