"use client"

import { useCallback } from "react"

import { useSidebar } from "@/components/ui/sidebar"

type UseCloseSidebarOptions = {
  mobileOnly?: boolean
}

export function useCloseSidebar({
  mobileOnly = false,
}: UseCloseSidebarOptions = {}) {
  const { isMobile, setOpen, setOpenMobile } = useSidebar()

  return useCallback(() => {
    if (isMobile) {
      setOpenMobile(false)
      return
    }

    if (!mobileOnly) {
      setOpen(false)
    }
  }, [isMobile, mobileOnly, setOpen, setOpenMobile])
}
