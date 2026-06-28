import type { ModerationStatus } from "@/types/enums"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const styles: Record<ModerationStatus, string> = {
  APPROVED: "border-black bg-black text-white",
  PENDING_MODERATION: "border-border-card bg-white text-text-secondary",
  FAILED_MODERATION: "border-[#FD1C1C] bg-white text-[#FD1C1C]",
  PENDING_GENDER_REVIEW: "border-[#D1D1D1] bg-white text-[#565656]",
}

const labels: Record<ModerationStatus, string> = {
  APPROVED: "Approved",
  PENDING_MODERATION: "Pending",
  FAILED_MODERATION: "Failed",
  PENDING_GENDER_REVIEW: "Gender Review",
}

export function ModerationStatusBadge({ status }: { status: ModerationStatus }) {
  return (
    <Badge variant="outline" className={cn("rounded-full text-xs font-medium", styles[status])}>
      {labels[status]}
    </Badge>
  )
}
