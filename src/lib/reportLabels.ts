import type { ReportContentType } from "@/types/enums"

export const REPORT_TYPE_LABELS: Record<ReportContentType | "ALL", string> = {
  ALL: "All types",
  PROFILE: "Profile",
  STORY: "Story",
  CHAT: "Chat",
}

export function reportTypeLabel(type: ReportContentType | string) {
  if (type in REPORT_TYPE_LABELS) {
    return REPORT_TYPE_LABELS[type as ReportContentType]
  }
  return type
}

/** Shown on hover next to Dismiss actions */
export const DISMISS_REPORT_HINT =
  "Removes this report and recalculates the reported user's warnings."

/** Confirm dialog before dismiss */
export const DISMISS_REPORT_CONFIRM =
  "Dismiss this report?\n\nIt will be removed from the list. The reported user's warning count will be updated from their remaining reports, and they may be unbanned if warnings drop below 3."
