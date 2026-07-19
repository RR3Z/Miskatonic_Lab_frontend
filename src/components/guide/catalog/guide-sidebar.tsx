"use client"

import Image from "next/image"
import Link from "next/link"

import { BrandMark } from "@/components/brand/brand-mark"
import { ErrorCatalog } from "@/components/errors/error-catalog"
import { GuideCatalog } from "@/components/guide/catalog/guide-catalog"
import { SidebarSiteFooter } from "@/components/layout/site-footer"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
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
              tooltip="Miskatonic Lab"
            >
              <Link
                aria-label="Miskatonic Lab home"
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
        <ErrorCatalog onNavigate={closeSidebar} />
      </SidebarContent>

      <SidebarFooter>
        <SidebarSiteFooter fullWidth />
      </SidebarFooter>
    </Sidebar>
  )
}
