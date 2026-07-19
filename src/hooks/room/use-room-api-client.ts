"use client"

import { useAuth } from "@clerk/nextjs"
import { useMemo } from "react"

import { createApiClient } from "@/lib/api/client"

export function useRoomApiClient() {
  const { getToken } = useAuth()
  return useMemo(() => createApiClient(getToken), [getToken])
}
