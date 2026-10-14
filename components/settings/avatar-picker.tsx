import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { AVATARS, getAvatarSrc } from "@/lib/constant"
import type { AvatarId } from "@/types/setting"

interface AvatarPickerProps {
  value: AvatarId
  onChange: (id: AvatarId) => void
  /** Used for the preview alt text and fallback initial. */
  username?: string
}

export function AvatarPicker({ value, onChange, username = "" }: AvatarPickerProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={getAvatarSrc(value)} alt={username} />
        <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="space-y-2">
        <Label>Profile Picture</Label>
        <div className="flex gap-3" role="radiogroup" aria-label="Profile picture">
          {AVATARS.map((avatar) => (
            <button
              key={avatar.id}
              type="button"
              role="radio"
              aria-checked={value === avatar.id}
              onClick={() => onChange(avatar.id)}
              className={`rounded-xl border-2 p-2 transition ${
                value === avatar.id ? "border-primary" : "border-transparent hover:border-muted-foreground"
              }`}
            >
              <Image
                src={avatar.src}
                height={50}
                width={50}
                alt={avatar.label}
                className="h-16 w-16 rounded-full object-cover"
              />
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Choose your profile picture.</p>
      </div>
    </div>
  )
}