import { ScrollArea } from "@/components/ui/scroll-area/scroll-area"
import { TabsContent } from "@/components/ui/tabs/tabs-content"

export function ScrollableTabsContent({
  children,
  value,
}: {
  children: React.ReactNode
  value: string
}) {
  return (
    <TabsContent className="min-h-0 overflow-hidden" value={value}>
      <ScrollArea
        className="h-full min-h-0"
        data-testid={`character-tab-${value}-scroll-area`}
      >
        <div className="p-4">{children}</div>
      </ScrollArea>
    </TabsContent>
  )
}
