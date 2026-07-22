"use client"

import { SignInButton, useUser } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { BrandMark } from "@/components/brand/brand-mark"
import { ErrorSidebar } from "@/components/errors/error-sidebar"
import { GuideSidebar } from "@/components/guide/catalog/guide-sidebar"
import { navigationItems } from "@/components/layout/constants/sidebar-navigation.constants"
import { SidebarUserControls } from "@/components/layout/sidebar-user-controls"
import { SidebarSiteFooter } from "@/components/layout/site-footer"
import { isErrorDocumentationRoute } from "@/components/layout/utils/is-error-documentation-route.util"
import { isGuideRoute } from "@/components/layout/utils/is-guide-route.util"
import { isNavigationItemActive } from "@/components/layout/utils/is-navigation-item-active.util"
import { Sidebar } from "@/components/ui/sidebar/sidebar"
import { SidebarContent } from "@/components/ui/sidebar/sidebar-content"
import { SidebarFooter } from "@/components/ui/sidebar/sidebar-footer"
import { SidebarGroup } from "@/components/ui/sidebar/sidebar-group"
import { SidebarGroupContent } from "@/components/ui/sidebar/sidebar-group-content"
import { SidebarHeader } from "@/components/ui/sidebar/sidebar-header"
import { SidebarMenu } from "@/components/ui/sidebar/sidebar-menu"
import { SidebarMenuButton } from "@/components/ui/sidebar/sidebar-menu-button"
import { SidebarMenuItem } from "@/components/ui/sidebar/sidebar-menu-item"
import layoutContent from "@/data/locales/ru/layout/layout.ru.json"
import { landingContent } from "@/data/locales/utils/landing-content.util"
import { useCloseSidebar } from "@/hooks/layout/use-close-sidebar"
import { appRoutes } from "@/lib/routes/app-routes"

export function AppSidebar() {
  const pathname = usePathname()
  const { isLoaded, isSignedIn } = useUser()
  const closeSidebar = useCloseSidebar()

  if (isGuideRoute(pathname)) {
    return <GuideSidebar />
  }

  if (isErrorDocumentationRoute(pathname)) {
    return <ErrorSidebar />
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
              tooltip={
                layoutContent.copy.componentsLayoutSidebarNavigation
                  .brandTooltip
              }
            >
              <Link
                aria-label={
                  layoutContent.copy.componentsLayoutSidebarNavigation
                    .homeAriaLabel
                }
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
