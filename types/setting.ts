export type AvatarId = "man" | "woman"

export interface Profile {
  username: string
  email: string
  fullName: string
  bio: string
  nativeLanguage: string
  avatarId: AvatarId
}

/** Fields the user is allowed to edit (username & email are read-only). */
export type EditableProfile = Pick<Profile, "fullName" | "bio" | "nativeLanguage" | "avatarId">

export interface SelectOption {
  value: string
  label: string
}