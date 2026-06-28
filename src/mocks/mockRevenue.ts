import type {
  RevenueSummary,
  RevenueDailyPoint,
  TopBuyer,
  PackCodeBreakdownItem,
  PremiumPlanMixItem,
} from "@/types"
import type { TimeWindow } from "@/types/enums"
import { USER_IDS } from "./helpers"

const summaries: Record<TimeWindow, RevenueSummary> = {
  "7d": {
    totalRevenue: 84200,
    subscriptionsSold: 42,
    boostsSold: 118,
    commentPacksSold: 34,
    chatUnlocksSold: 21,
  },
  "30d": {
    totalRevenue: 312400,
    subscriptionsSold: 168,
    boostsSold: 502,
    commentPacksSold: 140,
    chatUnlocksSold: 88,
  },
  "6m": {
    totalRevenue: 1450000,
    subscriptionsSold: 820,
    boostsSold: 2100,
    commentPacksSold: 640,
    chatUnlocksSold: 410,
  },
  "1y": {
    totalRevenue: 2890000,
    subscriptionsSold: 1640,
    boostsSold: 4200,
    commentPacksSold: 1280,
    chatUnlocksSold: 820,
  },
  all: {
    totalRevenue: 3200000,
    subscriptionsSold: 1820,
    boostsSold: 4800,
    commentPacksSold: 1450,
    chatUnlocksSold: 910,
  },
}

export function getMockRevenueSummary(window: TimeWindow): RevenueSummary {
  return summaries[window]
}

export function getMockRevenueDaily(window: TimeWindow): RevenueDailyPoint[] {
  const days = window === "7d" ? 7 : window === "30d" ? 30 : 30
  return Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    return {
      date: d.toISOString().slice(0, 10),
      subscriptions: Math.floor(2 + Math.random() * 8),
      boosts: Math.floor(4 + Math.random() * 14),
      comments: Math.floor(1 + Math.random() * 6),
      chatUnlocks: Math.floor(1 + Math.random() * 4),
    }
  })
}

export const mockTopBuyers: TopBuyer[] = [
  {
    userId: USER_IDS.priya,
    userName: "Priya Sharma",
    totalPurchases: 12,
    totalSpend: 6840,
    premiumStatus: "ACTIVE",
    accountState: "ACTIVE",
  },
  {
    userId: USER_IDS.maya,
    userName: "Maya Iyer",
    totalPurchases: 9,
    totalSpend: 5210,
    premiumStatus: "ACTIVE",
    accountState: "ACTIVE",
  },
  {
    userId: USER_IDS.rahul,
    userName: "Rahul Kapoor",
    totalPurchases: 7,
    totalSpend: 3890,
    premiumStatus: "EXPIRED",
    accountState: "ACTIVE",
  },
]

export const mockPackBreakdown: PackCodeBreakdownItem[] = [
  { packCode: "BOOST_1", count: 420 },
  { packCode: "BOOST_5", count: 280 },
  { packCode: "BOOST_15", count: 95 },
  { packCode: "COMMENTS_3", count: 180 },
  { packCode: "COMMENTS_10", count: 64 },
]

export const mockPremiumPlanMix: PremiumPlanMixItem[] = [
  { planCode: "PREMIUM_WEEK", count: 120, percentage: 13.5 },
  { planCode: "PREMIUM_MONTH", count: 620, percentage: 69.7 },
  { planCode: "PREMIUM_THREE_MONTHS", count: 150, percentage: 16.8 },
]
