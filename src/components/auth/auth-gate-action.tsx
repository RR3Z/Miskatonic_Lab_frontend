"use client"

import { useUser } from "@clerk/nextjs"
import type { VariantProps } from "class-variance-authority"
import Link from "next/link"
import type * as React from "react"

import { CustomSignInButton } from "@/components/auth/sign-in-button"
import { Button, type buttonVariants } from "@/components/ui/button"

type AuthGateActionProps = VariantProps<typeof buttonVariants> & {
  ariaCurrent?: React.AriaAttributes["aria-current"]
  children: React.ReactNode
  className?: string
  href: string
  onNavigate?: React.MouseEventHandler<HTMLAnchorElement>
}

export function AuthGateAction({
  ariaCurrent,
  children,
  className,
  href,
  onNavigate,
  size,
  variant,
}: AuthGateActionProps) {
  const { isSignedIn } = useUser()

  if (isSignedIn) {
    return (
      <Button asChild className={className} size={size} variant={variant}>
        <Link aria-current={ariaCurrent} href={href} onClick={onNavigate}>
          {children}
        </Link>
      </Button>
    )
  }

  return (
    <CustomSignInButton
      className={className}
      forceRedirectUrl={href}
      size={size}
      variant={variant}
    >
      {children}
    </CustomSignInButton>
  )
}
