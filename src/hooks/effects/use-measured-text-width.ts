import * as React from "react"
import {
  getMeasuredTexts,
  measureMaxTextWidth,
} from "@/lib/utils/text-measure.util"

export function useMeasuredTextWidth(
  ref: React.RefObject<HTMLElement | null>,
  original: string,
  alternates: readonly string[],
) {
  const [maxWidth, setMaxWidth] = React.useState<number | null>(null)

  React.useLayoutEffect(() => {
    if (!ref.current) return
    const font = window.getComputedStyle(ref.current).font
    setMaxWidth(
      measureMaxTextWidth(getMeasuredTexts(original, alternates), font),
    )
  }, [alternates, original, ref])

  return maxWidth
}
