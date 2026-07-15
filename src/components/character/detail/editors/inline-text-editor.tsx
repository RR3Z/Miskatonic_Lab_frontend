"use client"

import { PencilLine } from "lucide-react"
import { Controller } from "react-hook-form"

import type { InlineTextEditorProps } from "@/components/character/detail/editors/inline-text-editor.types"
import { useInlineTextEditor } from "@/components/character/detail/editors/use-inline-text-editor"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils/cn.util"

export function InlineTextEditor({
  ariaLabel,
  className,
  displayClassName,
  errorMessage,
  inputClassName,
  maxLength,
  multiline = true,
  onSave,
  placeholder,
  schema,
  showEditIcon = true,
  value,
}: InlineTextEditorProps) {
  const { cancelEditing, form, isEditing, isPending, startEditing, submit } =
    useInlineTextEditor({ errorMessage, onSave, schema, value })

  if (!isEditing) {
    return (
      <button
        aria-label={ariaLabel}
        className={cn(
          "group/editor flex w-full cursor-text items-start gap-2 rounded-sm border border-transparent px-2 py-2 text-left transition-colors hover:border-[var(--ml-border-aged)] hover:bg-[var(--ml-surface-panel-raised)]/45 focus-visible:border-[var(--ml-focus-ring)] focus-visible:outline-none",
          multiline && "min-h-20",
          className,
        )}
        onClick={startEditing}
        type="button"
      >
        <span
          className={cn(
            "min-w-0 flex-1 whitespace-pre-wrap font-body text-sm leading-6",
            value
              ? "text-[var(--ml-ink-muted)]"
              : "text-[var(--ml-ink-muted)]/65",
            displayClassName,
          )}
        >
          {value || placeholder}
        </span>
        {showEditIcon ? (
          <PencilLine
            aria-hidden="true"
            className="mt-1 size-3.5 shrink-0 opacity-0 transition-opacity group-hover/editor:opacity-70 group-focus-visible/editor:opacity-70"
          />
        ) : null}
      </button>
    )
  }

  return (
    <form
      className={className}
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
    >
      <Controller
        control={form.control}
        name="value"
        render={({ field, fieldState }) => {
          const sharedProps = {
            ...field,
            "aria-label": ariaLabel,
            "aria-invalid": fieldState.invalid,
            autoFocus: true,
            className: cn(
              "bg-[var(--ml-surface-panel-raised)]",
              multiline && "min-h-20 resize-y",
              inputClassName,
            ),
            disabled: isPending,
            maxLength,
            onBlur: () => {
              field.onBlur()
              submit()
            },
            onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
              if (event.key === "Escape") {
                event.preventDefault()
                cancelEditing()
                return
              }

              const shouldSubmit = multiline
                ? event.key === "Enter" && (event.ctrlKey || event.metaKey)
                : event.key === "Enter"

              if (shouldSubmit) {
                event.preventDefault()
                submit()
              }
            },
            placeholder,
          }

          return (
            <>
              {multiline ? (
                <Textarea {...sharedProps} />
              ) : (
                <Input {...sharedProps} />
              )}
              {fieldState.error ? (
                <p className="mt-1 font-body text-xs text-destructive">
                  {fieldState.error.message}
                </p>
              ) : null}
            </>
          )
        }}
      />
    </form>
  )
}
