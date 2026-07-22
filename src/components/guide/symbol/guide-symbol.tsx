import Image from "next/image"

import { guideSymbols } from "@/components/guide/symbol/constants/guide-symbols.constants"
import { cn } from "@/lib/utils/cn.util"
import type { GuideSymbolName } from "@/types/guide-content.types"

type GuideSymbolProps = {
  alt?: string
  className?: string
  priority?: boolean
  symbol: GuideSymbolName
}

export function GuideSymbol({
  alt = "",
  className,
  priority = false,
  symbol,
}: GuideSymbolProps) {
  return (
    <Image
      alt={alt}
      className={cn("object-contain", className)}
      priority={priority}
      src={guideSymbols[symbol]}
    />
  )
}
