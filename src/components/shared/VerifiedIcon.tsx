import { BadgeCheck } from "lucide-react"
import { cn } from "@/lib/utils"

export function VerifiedIcon({
  verified,
  className,
}: {
  verified: boolean
  className?: string
}) {
  if (!verified) {
    return <span className={cn("text-xs text-text-disabled", className)}>—</span>
  }

  return <BadgeCheck className={cn("size-4 text-[#1675F2]", className)} aria-label="Verified" />
}
