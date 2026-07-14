"use client"

import Image from "next/image"

import { characterStatVisuals } from "@/components/character/character-stat-visuals"
import { DeleteResourceButton } from "@/components/character/detail/editors/delete-resource-button"
import { InlineTextEditor } from "@/components/character/detail/editors/inline-text-editor"
import { CHARACTER_RESOURCE_TONE_CLASSES } from "@/components/character/detail/header/character-resource-tone-classes"
import type { ResourceStatDefinition } from "@/components/character/detail/header/character-stat-types"
import { characterIntegerTextSchema } from "@/dto/character/character-sheet-values.dto"
import { cn } from "@/lib/utils/cn.util"

export function ResourceStat({
  current,
  currentField,
  label,
  max,
  maxField,
  onDelete,
  onSave,
  resource,
  showDelete,
  tone,
  visualKey,
}: ResourceStatDefinition & {
  onDelete: () => Promise<unknown>
  onSave: (field: string, value: number) => Promise<unknown>
  showDelete: boolean
}) {
  const visual = characterStatVisuals[visualKey]
  const Icon = visual.icon

  return (
    <div
      className={cn(
        "relative flex min-h-13 min-w-0 flex-col items-center justify-center overflow-hidden rounded-md border bg-[var(--ml-surface-panel-raised)]/75 px-2 py-1 text-center",
        CHARACTER_RESOURCE_TONE_CLASSES[tone],
      )}
      data-testid="character-resource"
      data-resource={resource}
    >
      {showDelete ? (
        <div className="absolute right-0.5 top-0.5 z-20">
          <DeleteResourceButton
            ariaLabel={`Удалить ресурс ${label}`}
            className="size-5 opacity-60 hover:opacity-100"
            description={`Значения ресурса «${label}» будут удалены.`}
            errorMessage={`Не удалось удалить ресурс «${label}»`}
            onDelete={onDelete}
            title={`Удалить ресурс «${label}»?`}
          />
        </div>
      ) : null}
      {visual.image ? (
        <Image
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute size-10 opacity-[0.16]"
          data-testid="character-resource-icon"
          height={40}
          src={visual.image}
          style={
            visual.imageFilter ? { filter: visual.imageFilter } : undefined
          }
          width={40}
        />
      ) : Icon ? (
        <Icon
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute size-10 opacity-[0.16]",
            visual.iconClassName,
          )}
          data-testid="character-resource-icon"
        />
      ) : null}
      <span className="relative z-10 block font-body text-[0.6rem] uppercase tracking-[0.12em] text-[var(--ml-ink-muted)]">
        {label}
      </span>
      <div className="relative z-10 flex w-full items-center justify-center font-mono text-base font-semibold tabular-nums">
        <InlineTextEditor
          ariaLabel={`Редактировать текущее значение ${label}`}
          className="w-10 p-0"
          displayClassName="justify-center text-center font-mono font-semibold text-current"
          errorMessage={`Не удалось сохранить ресурс «${label}»`}
          inputClassName="h-6 px-0.5 text-center font-mono text-xs"
          multiline={false}
          onSave={(value) => onSave(currentField, Number(value))}
          placeholder="0"
          schema={characterIntegerTextSchema}
          value={String(current)}
        />
        <span aria-hidden="true">/</span>
        <InlineTextEditor
          ariaLabel={`Редактировать максимальное значение ${label}`}
          className="w-10 p-0"
          displayClassName="justify-center text-center font-mono font-semibold text-current"
          errorMessage={`Не удалось сохранить ресурс «${label}»`}
          inputClassName="h-6 px-0.5 text-center font-mono text-xs"
          multiline={false}
          onSave={(value) => onSave(maxField, Number(value))}
          placeholder="0"
          schema={characterIntegerTextSchema}
          value={String(max)}
        />
      </div>
    </div>
  )
}
