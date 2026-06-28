import type { AccountState } from "@/types/enums"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatAccountStateLabel } from "@/lib/formatters"

const stateStyles: Record<AccountState, string> = {
  ACTIVE: "border-border-card bg-white text-text-secondary",
  PAUSED: "border-border-card bg-surface-input text-text-secondary",
  PRIVACY_MODE: "border-border-card bg-white text-text-secondary",
  HIDDEN_BY_MODERATION: "border-black bg-black text-white",
  BANNED: "border-[#FD1C1C] bg-white text-[#FD1C1C]",
  UNDERAGE_BLOCKED: "border-[#FD1C1C] bg-white text-[#FD1C1C]",
  PENDING_CAPTCHA: "border-border-card bg-surface-input text-text-muted",
  DELETED: "border-border-subtle bg-surface-input text-text-disabled",
}

export function AccountStateBadge({
  state,
  className,
  size = "default",
}: {
  state: AccountState
  className?: string
  size?: "default" | "lg"
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full font-medium",
        size === "lg" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-xs",
        stateStyles[state],
        className
      )}
    >
      {formatAccountStateLabel(state)}
    </Badge>
  )
}
