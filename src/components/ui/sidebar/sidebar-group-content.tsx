"use client"

import type * as React from "react"

import { cn } from "@/lib/utils/cn.util"

export function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn("w-full text-[0.95rem]", className)}
      {...props}
    />
  )
}
