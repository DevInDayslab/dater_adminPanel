import type { ReportStatus } from "@/types/enums"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const labels: Record<ReportStatus, string> = {
  PENDING: "Open",
  UNDER_REVIEW: "Under Review",
  RESOLVED: "Resolved",
  DISMISSED: "Dismissed",
}

const styles: Record<ReportStatus, string> = {
  PENDING: "border-border-card bg-white text-text-secondary",
  UNDER_REVIEW: "border-black bg-surface-input text-black",
  RESOLVED: "border-black bg-black text-white",
  DISMISSED: "border-border-card bg-white text-text-muted",
}

export function ReportStatusBadge({ status }: { status: ReportStatus }) {
  return (
    <Badge variant="outline" className={cn("rounded-full text-xs font-medium", styles[status])}>
      {labels[status]}
    </Badge>
  )
}
