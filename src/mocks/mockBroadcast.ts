import type { BroadcastRecord } from "@/types"
import { daysAgo } from "./helpers"

export const mockBroadcastHistory: BroadcastRecord[] = [
  {
    id: "bc1",
    title: "Premium Weekend Offer",
    body: "Get 30% off Premium this weekend only.",
    targetAudience: "All Users",
    recipientsCount: 10430,
    sentByAdminName: "Beer Singh",
    sentAt: daysAgo(7),
    deepLink: "dater://premium",
  },
  {
    id: "bc2",
    title: "Server Maintenance",
    body: "Brief downtime tonight at 2 AM IST for updates.",
    targetAudience: "Users Active in Last 7 Days",
    recipientsCount: 1842,
    sentByAdminName: "Beer Singh",
    sentAt: daysAgo(14),
    deepLink: null,
  },
]

export function estimateBroadcastAudience(audience: string, city?: string): number {
  switch (audience) {
    case "ALL_USERS":
      return 10430
    case "PREMIUM_ONLY":
      return 890
    case "FREE_ONLY":
      return 9540
    case "ACTIVE_7D":
      return 1842
    case "CITY":
      return city?.toLowerCase().includes("gurugram") ? 1420 : 680
    default:
      return 0
  }
}
