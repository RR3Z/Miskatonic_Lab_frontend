"use client"

import {
  SignInButton,
  SignOutButton,
  UserAvatar,
  useClerk,
  useUser,
} from "@clerk/nextjs"
import { LogIn, LogOut } from "lucide-react"

import {
  getMobileUserDisplayName,
  openProfileAfterNavigation,
} from "@/components/auth/mobile-user-controls.utils"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  useSidebar,
} from "@/components/ui/sidebar"
import { appRoutes } from "@/lib/routes/app-routes"

type SidebarUserControlsProps = {
  signInLabel: string
}

export function SidebarUserControls({ signInLabel }: SidebarUserControlsProps) {
  const { openUserProfile } = useClerk()
  const { isLoaded, isSignedIn, user } = useUser()
  const { setOpenMobile } = useSidebar()
  const closeMobileSidebar = () => setOpenMobile(false)

  if (!isLoaded) {
    return <SidebarMenuSkeleton showIcon />
  }

  if (!isSignedIn || !user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SignInButton mode="modal">
            <SidebarMenuButton
              onClick={closeMobileSidebar}
              tooltip={signInLabel}
            >
              <LogIn aria-hidden="true" />
              <span>{signInLabel}</span>
            </SidebarMenuButton>
          </SignInButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  const displayName = getMobileUserDisplayName(user)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() =>
            openProfileAfterNavigation(closeMobileSidebar, openUserProfile)
          }
          size="lg"
          tooltip={displayName}
        >
          <UserAvatar
            appearance={{
              elements: {
                avatarBox: {
                  height: "1.5rem",
                  width: "1.5rem",
                },
              },
            }}
          />
          <span>{displayName}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SignOutButton redirectUrl={appRoutes.home}>
          <SidebarMenuButton
            className="text-[var(--ml-clerk-danger)] hover:bg-[var(--ml-clerk-danger-bg)] hover:text-[var(--ml-clerk-danger)]"
            onClick={closeMobileSidebar}
            tooltip="Выйти"
          >
            <LogOut aria-hidden="true" />
            <span>Выйти</span>
          </SidebarMenuButton>
        </SignOutButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
