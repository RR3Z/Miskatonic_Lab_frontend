"use client"

import { PencilLine } from "lucide-react"
import { Controller } from "react-hook-form"

import type { InlineTextEditorProps } from "@/components/character/detail/editors/types/inline-text-editor.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ResizableTextarea } from "@/components/ui/resizable-textarea"
import { Textarea } from "@/components/ui/textarea"
import { useInlineTextEditor } from "@/hooks/character/use-inline-text-editor"
import { cn } from "@/lib/utils/cn.util"

export function InlineTextEditor({
  ariaLabel,
  className,
  displayClassName,
  errorMessage,
  inputAlign,
  inputClassName,
  inputMode,
  inputPattern,
  inputSize,
  inputVariant = "inline",
  maxLength,
  multiline = true,
  normalizeInput,
  onSave,
  placeholder,
  resizeStorageKey,
  schema,
  showEditIcon = true,
  value,
}: InlineTextEditorProps) {
  const { cancelEditing, form, isEditing, isPending, startEditing, submit } =
    useInlineTextEditor({ errorMessage, onSave, schema, value })

  if (!isEditing) {
    return (
      <Button
        aria-label={ariaLabel}
        className={cn(
          "group/editor flex w-full cursor-text items-start gap-2 rounded-sm border border-transparent px-2 py-2 text-left transition-colors hover:border-[var(--ml-border-aged)] hover:bg-[var(--ml-surface-panel-raised)]/45 focus-visible:border-[var(--ml-focus-ring)] focus-visible:outline-none",
          multiline && "min-h-20",
          className,
        )}
        onClick={startEditing}
        size="content"
        type="button"
        variant="unstyled"
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
      </Button>
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
        render={({ field }) => {
          const sharedProps = {
            ...field,
            "aria-label": ariaLabel,
            autoFocus: true,
            className: cn(inputClassName),
            disabled: isPending,
            maxLength,
            onChange: (
              event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => {
              field.onChange(
                normalizeInput ? normalizeInput(event.target.value) : event,
              )
            },
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

          return multiline && resizeStorageKey ? (
            <ResizableTextarea
              {...sharedProps}
              align={inputAlign}
              size={inputSize}
              storageKey={resizeStorageKey}
              variant={inputVariant}
            />
          ) : multiline ? (
            <Textarea
              {...sharedProps}
              align={inputAlign}
              size={inputSize}
              variant={inputVariant}
            />
          ) : (
            <Input
              {...sharedProps}
              align={inputAlign}
              inputMode={inputMode}
              pattern={inputPattern}
              size={inputSize}
              variant={inputVariant}
            />
          )
        }}
      />
    </form>
  )
}
