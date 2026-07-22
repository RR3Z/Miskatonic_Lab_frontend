"use client"

import Link from "next/link"
import { SidebarGroup } from "@/components/ui/sidebar/sidebar-group"
import { SidebarGroupContent } from "@/components/ui/sidebar/sidebar-group-content"
import { SidebarGroupLabel } from "@/components/ui/sidebar/sidebar-group-label"
import { SidebarMenu } from "@/components/ui/sidebar/sidebar-menu"
import { SidebarMenuButton } from "@/components/ui/sidebar/sidebar-menu-button"
import { SidebarMenuItem } from "@/components/ui/sidebar/sidebar-menu-item"
import localizedContent from "@/data/locales/ru/errors/pages.ru.json"
import { getAllErrorCodes, getPresentedError } from "@/lib/errors/catalog"
import { appRoutes } from "@/lib/routes/app-routes"

type ErrorCatalogProps = {
  onNavigate: () => void
}

export function ErrorCatalog({ onNavigate }: ErrorCatalogProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        {localizedContent.copy.componentsErrorsErrorCatalog.dokumentatsiya}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={appRoutes.errors} onClick={onNavigate}>
                {localizedContent.copy.componentsErrorsErrorCatalog.vseOshibki}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {getAllErrorCodes().map((code) => {
            const error = getPresentedError(code)
            return (
              <SidebarMenuItem key={code}>
                <SidebarMenuButton asChild tooltip={error.title}>
                  <Link href={appRoutes.error(code)} onClick={onNavigate}>
                    <span className="truncate">{code}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
