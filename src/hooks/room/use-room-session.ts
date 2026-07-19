"use client"

import { useAuth } from "@clerk/nextjs"

export function useRoomSession() {
  return useAuth()
}
