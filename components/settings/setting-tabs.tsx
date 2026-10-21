import type React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export interface SettingsTab {
  value: string
  label: string
  icon?: React.ReactNode
  description?: string
  content: React.ReactNode
}
export function SettingsTabs({ tabs, defaultValue }: { tabs: SettingsTab[]; defaultValue?: string }) {
  return (
    <Tabs defaultValue={defaultValue ?? tabs[0]?.value} className="grid gap-6 md:grid-cols-[220px_1fr] md:items-start">
      <TabsList className="flex h-auto w-full justify-start gap-1 overflow-x-auto rounded-2xl border bg-card p-1.5 md:flex-col md:overflow-visible md:p-2">
        {tabs.map((t) => (
          <TabsTrigger
            key={t.value}
            value={t.value}
            className="flex-1 justify-start gap-2.5 rounded-xl px-3 py-2.5 text-muted-foreground transition-colors hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none md:w-full md:flex-none"
          >
            {t.icon}
            <span className="font-medium">{t.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="min-w-0">
        {tabs.map((t) => (
          <TabsContent key={t.value} value={t.value} className="mt-0">
            {t.content}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  )
}