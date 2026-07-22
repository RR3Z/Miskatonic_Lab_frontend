"use client"

import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area"
import { ScrollBar } from "@/components/ui/scroll-area/scroll-bar"
import { cn } from "@/lib/utils/cn.util"

export function ScrollArea({
  children,
  className,
  scrollbarKeepMounted = false,
  ...props
}: ScrollAreaPrimitive.Root.Props & {
  scrollbarKeepMounted?: boolean
}) {
  return (
    <ScrollAreaPrimitive.Root
      className={cn("relative overflow-hidden", className)}
      data-slot="scroll-area"
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        className="size-full rounded-[inherit] [-ms-overflow-style:none] [scrollbar-width:none] outline-none transition-[color,box-shadow] [&::-webkit-scrollbar]:hidden focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1"
        data-slot="scroll-area-viewport"
      >
        <ScrollAreaPrimitive.Content data-slot="scroll-area-content">
          {children}
        </ScrollAreaPrimitive.Content>
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar keepMounted={scrollbarKeepMounted} />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}
