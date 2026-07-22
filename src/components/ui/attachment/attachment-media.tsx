import type { VariantProps } from "class-variance-authority"

import type * as React from "react"

import { attachmentMediaVariants } from "@/components/ui/attachment/styles/attachment.styles"
import { cn } from "@/lib/utils/cn.util"

export function AttachmentMedia({
  className,
  variant = "icon",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof attachmentMediaVariants>) {
  return (
    <div
      data-slot="attachment-media"
      data-variant={variant}
      className={cn(attachmentMediaVariants({ variant }), className)}
      {...props}
    />
  )
}
