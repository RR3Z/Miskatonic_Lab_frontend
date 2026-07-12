"use client"

import { SignOutButton, UserAvatar, useClerk, useUser } from "@clerk/nextjs"
import { LogIn, LogOut } from "lucide-react"

import {
  getMobileUserDisplayName,
  openProfileAfterNavigation,
} from "@/components/auth/mobile-user-controls.utils"
import { CustomSignInButton } from "@/components/auth/sign-in-button"
import { Button } from "@/components/ui/button"
import { appRoutes } from "@/lib/routes/app-routes"

type MobileUserControlsProps = {
  onNavigate: () => void
  signInLabel: string
}

export function MobileUserControls({
  onNavigate,
  signInLabel,
}: MobileUserControlsProps) {
  const { openUserProfile } = useClerk()
  const { isLoaded, isSignedIn, user } = useUser()

  if (!isLoaded) {
    return <div aria-hidden="true" className="h-10" />
  }

  if (!isSignedIn || !user) {
    return (
      <CustomSignInButton
        className="w-full justify-start px-3"
        onClick={onNavigate}
        variant="ghost"
      >
        <LogIn aria-hidden="true" />
        {signInLabel}
      </CustomSignInButton>
    )
  }

  const displayName = getMobileUserDisplayName(user)

  const handleOpenProfile = () => {
    openProfileAfterNavigation(onNavigate, openUserProfile)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        className="flex min-w-0 flex-1 items-center gap-3 rounded-md px-3 py-2 font-body text-base text-[var(--ml-ink-primary)] transition-colors hover:bg-[var(--ml-surface-panel-raised)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        onClick={handleOpenProfile}
        type="button"
      >
        <UserAvatar
          appearance={{
            elements: {
              avatarBox: {
                height: "2rem",
                width: "2rem",
              },
            },
          }}
        />
        <span className="truncate">{displayName}</span>
      </button>
      <SignOutButton redirectUrl={appRoutes.home}>
        <Button
          aria-label="Выйти"
          className="text-[var(--ml-clerk-danger)] hover:bg-[var(--ml-clerk-danger-bg)] hover:text-[var(--ml-clerk-danger)]"
          onClick={onNavigate}
          size="icon-lg"
          variant="ghost"
        >
          <LogOut aria-hidden="true" />
        </Button>
      </SignOutButton>
    </div>
  )
}
