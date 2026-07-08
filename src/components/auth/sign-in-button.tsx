"use client"

import { SignInButton } from "@clerk/nextjs"
import type { VariantProps } from "class-variance-authority"

import type { buttonVariants } from "@/components/ui/button"
import { Button } from "@/components/ui/button"

type SignInButtonLabProps = VariantProps<typeof buttonVariants> & {
  children: React.ReactNode
  className?: string
}

export function CustomSignInButton({
  children,
  className,
  size,
  variant,
}: SignInButtonLabProps) {
  return (
    <SignInButton mode="modal">
      <Button className={className} size={size} type="button" variant={variant}>
        {children}
      </Button>
    </SignInButton>
  )
}
