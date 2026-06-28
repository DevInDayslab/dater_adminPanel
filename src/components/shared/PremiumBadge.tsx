import type { PremiumStatus } from "@/types/enums"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function PremiumBadge({
  status,
  className,
}: {
  status: PremiumStatus
  className?: string
}) {
  if (status === "INACTIVE") {
    return (
      <Badge variant="outline" className={cn("rounded-full border-border-card text-xs text-text-secondary", className)}>
        Free
      </Badge>
    )
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full border-brand text-xs font-medium text-brand",
        status === "EXPIRED" && "border-border-card text-text-muted",
        className
      )}
    >
      {status === "ACTIVE" ? "Premium" : "Expired"}
    </Badge>
  )
}
