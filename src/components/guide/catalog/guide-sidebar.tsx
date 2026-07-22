"use client"

import Image from "next/image"
import Link from "next/link"

import { BrandMark } from "@/components/brand/brand-mark"
import { GuideCatalog } from "@/components/guide/catalog/guide-catalog"
import { SidebarSiteFooter } from "@/components/layout/site-footer"
import { Sidebar } from "@/components/ui/sidebar/sidebar"
import { SidebarContent } from "@/components/ui/sidebar/sidebar-content"
import { SidebarFooter } from "@/components/ui/sidebar/sidebar-footer"
import { SidebarHeader } from "@/components/ui/sidebar/sidebar-header"
import { SidebarMenu } from "@/components/ui/sidebar/sidebar-menu"
import { SidebarMenuButton } from "@/components/ui/sidebar/sidebar-menu-button"
import { SidebarMenuItem } from "@/components/ui/sidebar/sidebar-menu-item"
import layoutContent from "@/data/locales/ru/layout/layout.ru.json"
import { useCloseSidebar } from "@/hooks/layout/use-close-sidebar"
import { appRoutes } from "@/lib/routes/app-routes"

export function GuideSidebar() {
  const closeSidebar = useCloseSidebar({ mobileOnly: true })

  return (
    <Sidebar collapsible="none">
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
                  className="hidden size-7 shrink-0 rounded-md"
                  data-slot="sidebar-favicon"
                  height={28}
                  src="/favicon-48.png"
                  width={28}
                />
                <BrandMark className="w-36" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <GuideCatalog onNavigate={closeSidebar} />
      </SidebarContent>

      <SidebarFooter>
        <SidebarSiteFooter fullWidth />
      </SidebarFooter>
    </Sidebar>
  )
}
