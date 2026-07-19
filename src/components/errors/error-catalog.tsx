"use client"

import Link from "next/link"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { getAllErrorCodes, getPresentedError } from "@/lib/errors/catalog"
import { appRoutes } from "@/lib/routes/app-routes"

type ErrorCatalogProps = {
  onNavigate: () => void
}

export function ErrorCatalog({ onNavigate }: ErrorCatalogProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Документация</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={appRoutes.errors} onClick={onNavigate}>
                Все ошибки
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
