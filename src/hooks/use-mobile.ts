import * as React from "react"

// shadcn keeps this hook name; for this app, "mobile" means overlay navigation.
const SIDEBAR_OVERLAY_BREAKPOINT = 1200

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(
      `(max-width: ${SIDEBAR_OVERLAY_BREAKPOINT - 1}px)`,
    )
    const onChange = () => {
      setIsMobile(window.innerWidth < SIDEBAR_OVERLAY_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < SIDEBAR_OVERLAY_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
