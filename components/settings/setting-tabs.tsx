import type React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export interface SettingsTab {
  value: string
  label: string
  content: React.ReactNode
}

/** Config-driven tabs: add a section by adding an entry to the `tabs` array. */
export function SettingsTabs({ tabs, defaultValue }: { tabs: SettingsTab[]; defaultValue?: string }) {
  return (
    <Tabs defaultValue={defaultValue ?? tabs[0]?.value} className="space-y-4">
      <TabsList>
        {tabs.map((t) => (
          <TabsTrigger key={t.value} value={t.value}>
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((t) => (
        <TabsContent key={t.value} value={t.value} className="space-y-4">
          {t.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}