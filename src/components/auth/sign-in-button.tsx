"use client"

import { SignInButton } from "@clerk/nextjs"
import type { VariantProps } from "class-variance-authority"

import type { buttonVariants } from "@/components/ui/button"
import { Button } from "@/components/ui/button"

type SignInButtonLabProps = VariantProps<typeof buttonVariants> & {
  children: React.ReactNode
  className?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export function CustomSignInButton({
  children,
  className,
  onClick,
  size,
  variant,
}: SignInButtonLabProps) {
  return (
    <SignInButton mode="modal">
      <Button
        className={className}
        onClick={onClick}
        size={size}
        type="button"
        variant={variant}
      >
        {children}
      </Button>
    </SignInButton>
  )
}
