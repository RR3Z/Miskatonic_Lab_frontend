"use client"

import { useQueryClient } from "@tanstack/react-query"

import { roomQueryKeys } from "@/lib/api/room-query-keys"

export function useRoomInvalidation() {
  const queryClient = useQueryClient()

  return () => queryClient.invalidateQueries({ queryKey: roomQueryKeys.all })
}
