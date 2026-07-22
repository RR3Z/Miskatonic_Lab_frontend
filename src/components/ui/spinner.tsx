import { LoaderIcon } from "lucide-react"
import type * as React from "react"
import localizedContent from "@/data/locales/ru/common/ui.ru.json"

import { cn } from "@/lib/utils/cn.util"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: shadcn keeps loading semantics on the spinner SVG itself.
    <LoaderIcon
      aria-label={localizedContent.copy.componentsUiSpinner.zagruzka}
      className={cn("size-4 animate-spin", className)}
      data-slot="spinner"
      role="status"
      {...props}
    />
  )
}

export { Spinner }
