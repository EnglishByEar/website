import { Button } from "@/components/ui/button"
import { SettingsCard } from "@/components/settings/setting-card"

interface DeleteAccountCardProps {
  /** Wire this to your delete flow (ideally behind a confirmation dialog). */
  onDelete?: () => void
}

export function DeleteAccountCard({ onDelete }: DeleteAccountCardProps) {
  return (
    <SettingsCard
      title="Delete Account"
      description="Permanently delete your account and all associated data"
      footer={
        <Button variant="destructive" onClick={onDelete}>
          Delete Account
        </Button>
      }
    >
      <p className="text-sm text-muted-foreground">
        This action cannot be undone. Once you delete your account, all of your data will be permanently removed from
        our servers.
      </p>
    </SettingsCard>
  )
}