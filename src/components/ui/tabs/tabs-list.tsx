"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"

import type { VariantProps } from "class-variance-authority"
import { tabsListVariants } from "@/components/ui/tabs/styles/tabs.styles"

import { cn } from "@/lib/utils/cn.util"

export function TabsList({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      className={cn(tabsListVariants({ variant }), className)}
      data-slot="tabs-list"
      data-variant={variant}
      {...props}
    />
  )
}
