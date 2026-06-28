import type { TimeWindow } from "@/types/enums"

export const TIME_WINDOW_OPTIONS: { value: TimeWindow; label: string }[] = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "6m", label: "6 months" },
  { value: "1y", label: "1 year" },
  { value: "all", label: "All time" },
]

export const WARNING_REASONS = [
  "Inappropriate Photo",
  "Harassment in Chat",
  "Fake Profile",
  "Hate Speech",
  "Spam",
] as const

export const REPORT_REASONS = [
  "Fake Profile",
  "Inappropriate Content",
  "Scam or Commercial",
  "Hate Speech",
  "Off Dater behaviour",
  "Underage",
  "Rude or abusive behaviour",
] as const

export const PHOTO_REJECTION_REASONS = [
  "Nudity",
  "Violence",
  "Fake / Catfish",
  "Not a Face",
  "Underage Concern",
  "Other",
] as const

export const ACCOUNT_STATE_OPTIONS = [
  "ACTIVE",
  "PAUSED",
  "PRIVACY_MODE",
  "HIDDEN_BY_MODERATION",
  "BANNED",
  "UNDERAGE_BLOCKED",
  "PENDING_CAPTCHA",
  "DELETED",
] as const

export const GENDER_OPTIONS = ["Woman", "Man", "Nonbinary"] as const

export const USERS_PAGE_SIZE = 25

export const FREE_TIER_DAILY_PROFILE_VIEWS = 20

export const PREMIUM_GRANT_DURATIONS = [
  { label: "1 day", days: 1 },
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
  { label: "6 months", days: 180 },
] as const

export const MOCK_AVATAR = (seed: string) =>
  `https://images.unsplash.com/photo-${seed}?w=400&h=500&fit=crop&auto=format`

export const MOCK_SELFIE = (seed: string) =>
  `https://images.unsplash.com/photo-${seed}?w=300&h=400&fit=crop&auto=format`
