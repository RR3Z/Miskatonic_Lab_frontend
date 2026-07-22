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
} from "@/components/auth/utils/mobile-user-controls.util"
import { SidebarMenu } from "@/components/ui/sidebar/sidebar-menu"
import { SidebarMenuButton } from "@/components/ui/sidebar/sidebar-menu-button"
import { SidebarMenuItem } from "@/components/ui/sidebar/sidebar-menu-item"
import { SidebarMenuSkeleton } from "@/components/ui/sidebar/sidebar-menu-skeleton"
import localizedContent from "@/data/locales/ru/layout/layout.ru.json"
import { useSidebar } from "@/hooks/ui/use-sidebar"
import { appRoutes } from "@/lib/routes/app-routes"

type SidebarUserControlsProps = {
  signInLabel: string
}

export function SidebarUserControls({ signInLabel }: SidebarUserControlsProps) {
  const { openUserProfile } = useClerk()
  const { isLoaded, isSignedIn, user } = useUser()
  const { isMobile, setOpen, setOpenMobile } = useSidebar()
  const closeSidebar = () => (isMobile ? setOpenMobile(false) : setOpen(false))

  if (!isLoaded) {
    return <SidebarMenuSkeleton showIcon />
  }

  if (!isSignedIn || !user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SignInButton mode="modal">
            <SidebarMenuButton
              className="cursor-pointer"
              onClick={closeSidebar}
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
      <SidebarMenuItem
        className="flex items-center gap-1"
        data-slot="sidebar-user-row"
      >
        <SidebarMenuButton
          className="min-w-0 flex-1 cursor-pointer text-[1.05rem]"
          onClick={() =>
            openProfileAfterNavigation(closeSidebar, openUserProfile)
          }
          size="lg"
          tooltip={displayName}
        >
          <UserAvatar
            appearance={{
              elements: {
                avatarBox: {
                  cursor: "pointer",
                  height: "1.5rem",
                  width: "1.5rem",
                },
              },
            }}
          />
          <span>{displayName}</span>
        </SidebarMenuButton>
        <SignOutButton redirectUrl={appRoutes.home}>
          <SidebarMenuButton
            aria-label={
              localizedContent.copy.componentsLayoutSidebarUserControls.vyiti
            }
            className="size-9 w-9! shrink-0 cursor-pointer justify-center gap-0 p-0! text-[var(--ml-clerk-danger)] hover:bg-[var(--ml-clerk-danger-bg)] hover:text-[var(--ml-clerk-danger)] group-data-[collapsible=icon]:hidden"
            onClick={closeSidebar}
            tooltip={{
              children:
                localizedContent.copy.componentsLayoutSidebarUserControls.vyiti,
              hidden: false,
            }}
          >
            <LogOut aria-hidden="true" />
          </SidebarMenuButton>
        </SignOutButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
