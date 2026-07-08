"use client"

import { useUser } from "@clerk/nextjs"
import { LogIn } from "lucide-react"
import type * as React from "react"

import { CustomSignInButton } from "@/components/auth/sign-in-button"
import { UserMenu } from "@/components/auth/user-menu"

type HeaderAuthProps = {
  children: React.ReactNode
  className?: string
}

export function HeaderAuth({ children, className }: HeaderAuthProps) {
  const { isSignedIn } = useUser()

  if (isSignedIn) {
    return <UserMenu />
  }

  return (
    <CustomSignInButton className={className} variant="ghost">
      <LogIn aria-hidden="true" className="size-[1.05rem]" />
      {children}
    </CustomSignInButton>
  )
}
