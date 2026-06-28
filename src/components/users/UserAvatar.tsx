import { cn } from "@/lib/utils"

type UserAvatarProps = {
  src?: string | null
  name?: string | null
  className?: string
}

export function UserAvatar({ src, name, className }: UserAvatarProps) {
  const initials = name?.trim()?.charAt(0)?.toUpperCase() || "?"

  if (src) {
    return (
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        className={cn("shrink-0 rounded-md bg-surface-input object-cover", className)}
      />
    )
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md bg-surface-input text-sm font-medium text-text-secondary",
        className
      )}
      aria-hidden
    >
      {initials}
    </div>
  )
}
