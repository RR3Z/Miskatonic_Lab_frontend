import Image from "next/image"

import { guideSymbols } from "@/components/guide/symbol/constants/guide-symbols.constants"
import type { GuideSymbolName } from "@/data/guide/types/guide-content.types"
import { cn } from "@/lib/utils/cn.util"

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
