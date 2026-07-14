import { PencilLine } from "lucide-react"

import { SectionTitle } from "@/components/character/detail/tabs/section-title"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function EditableSectionHeader({
  editLabel,
  title,
  tooltip,
}: {
  editLabel: string
  title: string
  tooltip: string
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <SectionTitle>{title}</SectionTitle>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-disabled="true"
            aria-label={editLabel}
            className="aria-disabled:pointer-events-auto aria-disabled:cursor-not-allowed active:translate-y-0"
            onClick={(event) => event.preventDefault()}
            size="sm"
            tabIndex={0}
            type="button"
            variant="ghost"
          >
            <PencilLine aria-hidden="true" />
            Редактировать
          </Button>
        </TooltipTrigger>
        <TooltipContent
          className="border border-[#5d5231] bg-[#171411] text-[#d9d2c5] shadow-[0_14px_40px_rgba(0,0,0,0.55)] [&>span>svg]:bg-[#171411] [&>span>svg]:fill-[#171411]"
          side="bottom"
          sideOffset={6}
        >
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
