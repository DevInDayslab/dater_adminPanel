export const BROADCAST_AUDIENCE_OPTIONS = [
  { value: "ALL_USERS", label: "All users" },
  { value: "FREE_ONLY", label: "Free users only" },
  { value: "PREMIUM_ONLY", label: "Premium users only" },
] as const

export type BroadcastAudienceValue = (typeof BROADCAST_AUDIENCE_OPTIONS)[number]["value"]

const AUDIENCE_LABELS = Object.fromEntries(
  BROADCAST_AUDIENCE_OPTIONS.map((option) => [option.value, option.label])
) as Record<BroadcastAudienceValue, string>

const LEGACY_AUDIENCE_LABELS: Record<string, string> = {
  ACTIVE_7D: "Active in last 7 days",
  CITY: "Specific city",
}

export function broadcastAudienceLabel(audience: string) {
  if (audience in LEGACY_AUDIENCE_LABELS) {
    return LEGACY_AUDIENCE_LABELS[audience]
  }
  if (audience in AUDIENCE_LABELS) {
    return AUDIENCE_LABELS[audience as BroadcastAudienceValue]
  }
  return audience.replace(/_/g, " ")
}

/** Served from `public/dater-app-icon.svg` (copied from DaterApp/design/app_icon.svg). */
export const DATER_APP_ICON_URL = "/dater-app-icon.svg"
