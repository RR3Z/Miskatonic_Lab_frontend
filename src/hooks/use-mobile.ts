import * as React from "react"

// shadcn keeps this hook name; below md the navigation uses a Sheet.
const SIDEBAR_MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(
      `(max-width: ${SIDEBAR_MOBILE_BREAKPOINT - 1}px)`,
    )
    const onChange = () => {
      setIsMobile(window.innerWidth < SIDEBAR_MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < SIDEBAR_MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
