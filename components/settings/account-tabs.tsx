import { DeleteAccountCard } from "./delete-account-card"
import { PasswordForm } from "@/components/settings/pasword-form"

export function AccountTab() {
  return (
    <>
      <PasswordForm />
      <DeleteAccountCard />
    </>
  )
}