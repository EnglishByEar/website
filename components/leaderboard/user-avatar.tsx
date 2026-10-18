import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Props {
  username: string
  src?: string | null
  className?: string
}

export function UserAvatar({ username, src, className }: Props) {
  return (
    <Avatar className={cn("h-8 w-8", className)}>
      {src && <AvatarImage src={src} alt={username} />}
      <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}