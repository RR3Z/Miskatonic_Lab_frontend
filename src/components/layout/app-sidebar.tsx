"use client"

import { SignInButton, useUser } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { BrandMark } from "@/components/brand/brand-mark"
import { GuideSidebar } from "@/components/guide/catalog/guide-sidebar"
import {
  isNavigationItemActive,
  navigationItems,
} from "@/components/layout/sidebar-navigation"
import { SidebarUserControls } from "@/components/layout/sidebar-user-controls"
import { SidebarSiteFooter } from "@/components/layout/site-footer"
import { isGuideRoute } from "@/components/layout/utils/is-guide-route.util"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useCloseSidebar } from "@/hooks/layout/use-close-sidebar"
import { landingContent } from "@/lib/content/landing.content"
import { appRoutes } from "@/lib/routes/app-routes"

export function AppSidebar() {
  const pathname = usePathname()
  const { isLoaded, isSignedIn } = useUser()
  const closeSidebar = useCloseSidebar()

  if (isGuideRoute(pathname)) {
    return <GuideSidebar />
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-12 justify-center"
              size="lg"
              tooltip="Miskatonic Lab"
            >
              <Link
                aria-label="Miskatonic Lab home"
                href={appRoutes.home}
                onClick={closeSidebar}
              >
                <Image
                  alt=""
                  className="hidden size-7 shrink-0 rounded-md group-data-[collapsible=icon]:block"
                  data-slot="sidebar-favicon"
                  height={28}
                  src="/favicon-48.png"
                  width={28}
                />
                <BrandMark className="w-36 group-data-[collapsible=icon]:hidden" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = isNavigationItemActive(item, pathname)

                if (item.kind === "auth" && !isSignedIn) {
                  return (
                    <SidebarMenuItem key={item.label}>
                      <SignInButton forceRedirectUrl={item.href} mode="modal">
                        <SidebarMenuButton
                          disabled={!isLoaded}
                          onClick={closeSidebar}
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
                        onClick={closeSidebar}
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
    </Sidebar>
  )
}
