import { ScrollArea } from "@/components/ui/scroll-area"
import { TabsContent } from "@/components/ui/tabs"

export function ScrollableTabsContent({
  children,
  value,
}: {
  children: React.ReactNode
  value: string
}) {
  return (
    <TabsContent className="min-h-0 overflow-hidden" value={value}>
      <ScrollArea className="h-full">
        <div className="p-4">{children}</div>
      </ScrollArea>
    </TabsContent>
  )
}
