import Image from "next/image"

import { cn } from "@/lib/utils/cn.util"
import logo from "../../../assets/logo-transparent-1468w.webp"

type BrandMarkProps = {
  className?: string
  priority?: boolean
}

export function BrandMark({ className, priority = false }: BrandMarkProps) {
  return (
    <Image
      alt="Miskatonic Lab"
      className={cn("h-auto w-full object-contain", className)}
      height={450}
      priority={priority}
      sizes="(max-width: 768px) 9rem, 13rem"
      src={logo}
      width={1468}
    />
  )
}
