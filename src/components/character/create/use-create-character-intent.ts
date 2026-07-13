"use client"

import { useEffect, useState } from "react"

export function useCreateCharacterIntent(canOpen: boolean) {
  const [createOpen, setCreateOpen] = useState(false)

  useEffect(() => {
    if (!canOpen || typeof window === "undefined") return

    const url = new URL(window.location.href)
    if (url.searchParams.get("create") !== "1") return

    setCreateOpen(true)
    url.searchParams.delete("create")
    window.history.replaceState(
      {},
      "",
      `${url.pathname}${url.search}${url.hash}`,
    )
  }, [canOpen])

  return { createOpen, setCreateOpen }
}
