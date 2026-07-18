"use client"

import * as React from "react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils/cn.util"

const MIN_HEIGHT = 40

function readStoredHeight(storageKey: string) {
  if (typeof window === "undefined") return null

  try {
    const height = Number(window.localStorage.getItem(storageKey))
    return Number.isFinite(height) && height >= MIN_HEIGHT ? height : null
  } catch {
    return null
  }
}

function saveHeight(storageKey: string, height: number) {
  try {
    window.localStorage.setItem(storageKey, String(height))
  } catch {
    // Keep resizing functional when storage is unavailable.
  }
}

export const ResizableTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<typeof Textarea> & { storageKey: string }
>(function ResizableTextarea(
  { className, onChange, storageKey, style, value, ...props },
  forwardedRef,
) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const autoHeightRef = React.useRef<number | null>(null)
  const storedHeight = React.useMemo(
    () => readStoredHeight(storageKey),
    [storageKey],
  )
  const [contentHeight, setContentHeight] = React.useState(MIN_HEIGHT)
  const [height, setHeight] = React.useState<number | null>(storedHeight)
  const [hasManualHeight, setHasManualHeight] = React.useState(
    storedHeight !== null,
  )

  const setTextareaRef = React.useCallback(
    (node: HTMLTextAreaElement | null) => {
      textareaRef.current = node

      if (typeof forwardedRef === "function") forwardedRef(node)
      else if (forwardedRef) forwardedRef.current = node
    },
    [forwardedRef],
  )

  const resizeToContent = React.useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = "0px"
    const nextContentHeight = Math.max(MIN_HEIGHT, textarea.scrollHeight)
    textarea.style.height = `${nextContentHeight}px`
    setContentHeight(nextContentHeight)

    if (!hasManualHeight) {
      autoHeightRef.current = nextContentHeight
      setHeight(nextContentHeight)
    }
  }, [hasManualHeight])

  React.useEffect(() => {
    resizeToContent()
  }, [resizeToContent])

  React.useEffect(() => {
    const container = containerRef.current
    if (!container || typeof ResizeObserver === "undefined") return

    const observer = new ResizeObserver(([entry]) => {
      const nextHeight = Math.max(
        MIN_HEIGHT,
        Math.round(entry.contentRect.height),
      )

      if (autoHeightRef.current === nextHeight) {
        autoHeightRef.current = null
        return
      }

      setHasManualHeight(true)
      setHeight(nextHeight)
      saveHeight(storageKey, nextHeight)
    })

    observer.observe(container)
    return () => observer.disconnect()
  }, [storageKey])

  return (
    <div
      className="min-h-10 w-full resize-y overflow-hidden rounded-sm"
      data-slot="resizable-textarea"
      ref={containerRef}
      style={height ? { height } : undefined}
    >
      <ScrollArea className="h-full w-full" scrollbarKeepMounted>
        <Textarea
          {...props}
          className={cn(
            "block min-h-10 resize-none overflow-hidden",
            className,
          )}
          onChange={(event) => {
            onChange?.(event)
            requestAnimationFrame(resizeToContent)
          }}
          ref={setTextareaRef}
          style={{ ...style, height: contentHeight }}
          value={value}
        />
      </ScrollArea>
    </div>
  )
})
