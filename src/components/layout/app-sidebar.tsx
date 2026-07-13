"use client"

import { SignInButton, useUser } from "@clerk/nextjs"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { BrandMark } from "@/components/brand/brand-mark"
import {
  isNavigationItemActive,
  navigationItems,
} from "@/components/layout/sidebar-navigation"
import { SidebarUserControls } from "@/components/layout/sidebar-user-controls"
import { SidebarSiteFooter } from "@/components/layout/site-footer"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { landingContent } from "@/lib/content/landing.content"
import { appRoutes } from "@/lib/routes/app-routes"

export function AppSidebar() {
  const pathname = usePathname()
  const { isLoaded, isSignedIn } = useUser()
  const { setOpenMobile } = useSidebar()
  const closeMobileSidebar = () => setOpenMobile(false)

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-12"
              size="lg"
              tooltip="Miskatonic Lab"
            >
              <Link
                aria-label="Miskatonic Lab home"
                href={appRoutes.home}
                onClick={closeMobileSidebar}
              >
                <span className="hidden size-7 shrink-0 items-center justify-center rounded-md border border-[var(--ml-border-aged)] font-heading text-xs font-semibold group-data-[collapsible=icon]:flex">
                  ML
                </span>
                <BrandMark className="w-36 group-data-[collapsible=icon]:hidden" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Навигация</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = isNavigationItemActive(item, pathname)

                if (item.kind === "disabled") {
                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        aria-disabled="true"
                        disabled
                        tooltip={item.label}
                      >
                        <Icon aria-hidden="true" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                      <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                    </SidebarMenuItem>
                  )
                }

                if (item.kind === "auth" && !isSignedIn) {
                  return (
                    <SidebarMenuItem key={item.label}>
                      <SignInButton mode="modal">
                        <SidebarMenuButton
                          disabled={!isLoaded}
                          onClick={closeMobileSidebar}
                          tooltip={item.label}
                        >
                          <Icon aria-hidden="true" />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SignInButton>
                    </SidebarMenuItem>
                  )
                }

                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                    >
                      <Link
                        aria-current={isActive ? "page" : undefined}
                        href={item.href}
                        onClick={closeMobileSidebar}
                      >
                        <Icon aria-hidden="true" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarUserControls signInLabel={landingContent.header.signIn} />
        <SidebarSiteFooter />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
