"use client"

import { SignInButton } from "@clerk/nextjs"
import type { VariantProps } from "class-variance-authority"

import type { buttonVariants } from "@/components/ui/button"
import { Button } from "@/components/ui/button"

type SignInButtonLabProps = VariantProps<typeof buttonVariants> & {
  children: React.ReactNode
  className?: string
  forceRedirectUrl?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export function CustomSignInButton({
  children,
  className,
  forceRedirectUrl,
  onClick,
  size,
  variant,
}: SignInButtonLabProps) {
  return (
    <SignInButton forceRedirectUrl={forceRedirectUrl} mode="modal">
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
