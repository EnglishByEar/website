import type { AvatarId, Profile, SelectOption } from "@/types/setting"

export const AVATARS: { id: AvatarId; label: string; src: string }[] = [
  { id: "man", label: "Man", src: "/avatars/man.jpg" },
  { id: "woman", label: "Woman", src: "/avatars/woman.jpg" },
]

export const getAvatarSrc = (id: string) => (AVATARS.find((a) => a.id === id) ?? AVATARS[0]).src

export const LANGUAGES: SelectOption[] = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "chinese", label: "Chinese" },
  { value: "japanese", label: "Japanese" },
  { value: "korean", label: "Korean" },
  { value: "russian", label: "Russian" },
  { value: "arabic", label: "Arabic" },
  { value: "other", label: "Other" },
]

export const DEFAULT_PROFILE: Profile = {
  username: "",
  email: "",
  fullName: "",
  bio: "",
  nativeLanguage: "english",
  avatarId: "man",
}

export const MIN_PASSWORD_LENGTH = 8