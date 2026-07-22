import * as React from "react"

export function useMarqueeLoopWidth() {
  const firstGroupRef = React.useRef<HTMLDivElement>(null)
  const [groupWidth, setGroupWidth] = React.useState(0)

  React.useLayoutEffect(() => {
    const group = firstGroupRef.current
    if (!group) return

    const updateWidth = () => setGroupWidth(group.offsetWidth)
    updateWidth()

    if (typeof ResizeObserver === "undefined") return

    const observer = new ResizeObserver(updateWidth)
    observer.observe(group)

    return () => observer.disconnect()
  }, [])

  return { firstGroupRef, groupWidth }
}
