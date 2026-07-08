"use client"

import { UserButton } from "@clerk/nextjs"
import { userButtonCompactElements } from "@/lib/clerk/appearance"

export function UserMenu() {
  return (
    <UserButton
      appearance={{
        elements: userButtonCompactElements,
      }}
    />
  )
}
