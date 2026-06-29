import {
  clearStoredSession,
  readStoredSession,
  writeStoredSession,
  type StoredAdminSession,
} from "@/lib/authStorage"
import type { DashboardGrowthWindow, TimeWindow } from "@/types/enums"
import type {
  BoostActivation,
  BoostWallet,
  ChatUnlockEvent,
  CommentWallet,
  DailyProfileViewUsage,
  GrowthDataPoint,
  UserBlock,
  ChatMessage,
  ChatThreadSummary,
  UserDetailBundle,
  UserFiltersDetail,
  UserListItem,
  UserPhoto,
  UserProfileDetail,
  UserPurchase,
  UserReport,
  VerificationSession,
} from "@/types"

function resolveApiBase(): string {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim()
  if (configured) {
    return configured.replace(/\/$/, "")
  }

  // Production on Vercel: use same-origin proxy defined in vercel.json.
  if (import.meta.env.PROD) {
    return "/api/v1"
  }

  // Local dev: Vite proxies /api to the backend (see vite.config.ts).
  return "/api/v1"
}

const API_BASE = resolveApiBase()

export class ApiError extends Error {
  status: number
  code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.code = code
  }
}

type ApiEnvelope<T> = {
  success: boolean
  message: string
  data: T
  code?: string
  error?: string
}

function getAccessToken(): string | null {
  return readStoredSession()?.accessToken ?? null
}

function handleUnauthorized() {
  clearStoredSession()
  if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
    window.location.assign("/login")
  }
}

async function parseEnvelope<T>(response: Response): Promise<T> {
  if (response.status === 502 || response.status === 503 || response.status === 504) {
    throw new ApiError("Admin API is unreachable. Check your network or API URL.", response.status)
  }

  let payload: ApiEnvelope<T> | null = null
  try {
    payload = (await response.json()) as ApiEnvelope<T>
  } catch {
    if (response.status === 401) {
      handleUnauthorized()
      throw new ApiError("Unauthorized", 401)
    }
    if (response.status === 404) {
      throw new ApiError(
        API_BASE.startsWith("/")
          ? "Admin API not found. Redeploy on Vercel after setting VITE_API_BASE_URL=/api/v1."
          : `Admin API not found at ${API_BASE}. Check VITE_API_BASE_URL and redeploy.`,
        404
      )
    }
    throw new ApiError(`Request failed (${response.status})`, response.status)
  }

  if (response.status === 401) {
    handleUnauthorized()
    throw new ApiError(payload?.message || "Unauthorized", 401, payload?.code)
  }

  if (!response.ok || !payload?.success) {
    throw new ApiError(
      payload?.message || payload?.error || `Request failed (${response.status})`,
      response.status,
      payload?.code
    )
  }

  return payload.data
}

export async function adminRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers ?? {})
  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json")
  }

  const token = getAccessToken()
  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  let response: Response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers,
    })
  } catch {
    throw new ApiError("Network error — could not reach the admin API.", 0)
  }

  return parseEnvelope<T>(response)
}

export type AdminLoginResponse = {
  accessToken: string
  expiresAt: string
  admin: StoredAdminSession["admin"]
}

export type DashboardStatsResponse = {
  totalUsers: number
  dau: number
  mau: number
  activePremiumUsers: number
  boostsSold: number
  commentsSold: number
  chatUnlocksSold: number
  totalReports: number
  bannedUsers: number
  pendingPhotoReview: number
  window: string
}

export type DashboardBreakdownsResponse = {
  genderBreakdown: Array<{
    genderMain: string
    count: number
    percentage: number
  }>
  accountStateBreakdown: Array<{
    accountState: string
    count: number
  }>
  onboardingFunnel: Array<{
    onboardingStep: string
    count: number
  }>
  verificationStats: {
    verifiedCount: number
    unverifiedCount: number
    successRate: number
    totalAttempts: number
  }
}

export type DashboardRevenueResponse = {
  window: string
  summary: {
    boostsSold: number
    commentPacksSold: number
    subscriptionsSold: number
    chatUnlocksSold: number
  }
  daily: Array<{
    date: string
    subscriptions: number
    boosts: number
    comments: number
    chatUnlocks: number
  }>
}

export type DashboardBadgesResponse = {
  totalReports: number
  bannedUsers: number
}

export type DashboardGrowthResponse = {
  window: string
  data: GrowthDataPoint[]
}

export type RevenuePageSummaryResponse = {
  window: string
  summary: import("@/types").RevenueSummary
  daily: import("@/types").RevenueDailyPoint[]
  premiumPlanMix: import("@/types").PremiumPlanMixItem[]
}

export type RevenueTopBuyersResponse = {
  window: string
  items: import("@/types").TopBuyer[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type RevenuePackBreakdownResponse = {
  window: string
  items: import("@/types").PackCodeBreakdownItem[]
}

export type UsersListQuery = {
  search?: string
  state?: string
  premium?: "premium" | "free"
  verified?: "verified" | "unverified"
  gender?: string
  page?: number
  limit?: number
  sort?: string
}

export type UsersListResponse = {
  users: UserListItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type UserTrustResponse = {
  accountState: UserProfileDetail["accountState"]
  moderationWarningCount: number
  moderationConsecutiveWarningCount: number
  moderationWarningsAcknowledged: number
  pausedUntil: string | null
  profileHiddenAt: string | null
  reportsAgainst: UserReport[]
  reportsFiled: UserReport[]
  blocks: UserBlock[]
}

export type UserRevenueResponse = {
  premiumStatus: UserProfileDetail["premiumStatus"]
  premiumPlanCode: UserProfileDetail["premiumPlanCode"]
  premiumStartedAt: string | null
  premiumExpiresAt: string | null
  boostWallet: BoostWallet
  commentWallet: CommentWallet
  activeBoost: BoostActivation | null
  boostActivations: BoostActivation[]
  purchases: UserPurchase[]
  purchaseCounts: {
    subscriptions: number
    boosts: number
    comments: number
    chatUnlocks: number
  }
  chatUnlocks: ChatUnlockEvent[]
  dailyProfileViewUsage: DailyProfileViewUsage
}

function buildQuery(params: Record<string, string | number | undefined | null>) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value == null || value === "") continue
    search.set(key, String(value))
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ""
}

export const adminApi = {
  login(email: string, password: string) {
    return adminRequest<AdminLoginResponse>("/admin/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  },

  logout() {
    return adminRequest<Record<string, never>>("/admin/auth/logout", {
      method: "POST",
    })
  },

  getDashboardStats() {
    return adminRequest<DashboardStatsResponse>("/admin/dashboard/stats")
  },

  getDashboardGrowth(window: DashboardGrowthWindow) {
    return adminRequest<DashboardGrowthResponse>(`/admin/dashboard/growth?window=${window}`)
  },

  getDashboardBadges() {
    return adminRequest<DashboardBadgesResponse>("/admin/dashboard/badges")
  },

  getDashboardBreakdowns() {
    return adminRequest<DashboardBreakdownsResponse>("/admin/dashboard/breakdowns")
  },

  getDashboardRevenue(window: TimeWindow) {
    return adminRequest<DashboardRevenueResponse>(`/admin/dashboard/revenue?window=${window}`)
  },

  getRevenueSummary(window: TimeWindow) {
    return adminRequest<RevenuePageSummaryResponse>(`/admin/revenue/summary?window=${window}`)
  },

  getRevenueTopBuyers(window: TimeWindow, page = 1) {
    return adminRequest<RevenueTopBuyersResponse>(
      `/admin/revenue/top-buyers?window=${window}&page=${page}&limit=25`
    )
  },

  getRevenuePackBreakdown(window: TimeWindow) {
    return adminRequest<RevenuePackBreakdownResponse>(
      `/admin/revenue/pack-breakdown?window=${window}`
    )
  },

  listUsers(query: UsersListQuery = {}) {
    return adminRequest<UsersListResponse>(
      `/admin/users${buildQuery({
        search: query.search,
        state: query.state,
        premium: query.premium,
        verified: query.verified,
        gender: query.gender,
        page: query.page,
        limit: query.limit,
        sort: query.sort,
      })}`
    )
  },

  getUserProfile(userId: string) {
    return adminRequest<UserProfileDetail>(`/admin/users/${userId}/profile`)
  },

  getUserTrust(userId: string) {
    return adminRequest<UserTrustResponse>(`/admin/users/${userId}/trust`)
  },

  getUserRevenue(userId: string) {
    return adminRequest<UserRevenueResponse>(`/admin/users/${userId}/revenue`)
  },

  getUserPhotos(userId: string) {
    return adminRequest<{ photos: UserPhoto[] }>(`/admin/users/${userId}/photos`)
  },

  getUserVerification(userId: string) {
    return adminRequest<{
      verificationSelfieUrl: string | null
      verifiedAt: string | null
      verificationLastAttemptAt: string | null
      sessions: VerificationSession[]
    }>(`/admin/users/${userId}/verification`)
  },

  getUserFilters(userId: string) {
    return adminRequest<UserFiltersDetail>(`/admin/users/${userId}/filters`)
  },

  getUserContent(userId: string) {
    return adminRequest<Pick<UserDetailBundle, "activeStory" | "storyHistory">>(
      `/admin/users/${userId}/content`
    )
  },

  getUserChat(userId: string) {
    return adminRequest<{ threads: ChatThreadSummary[] }>(`/admin/users/${userId}/chat`)
  },

  getUserChatMessages(userId: string, threadId: string) {
    return adminRequest<{ messages: ChatMessage[] }>(
      `/admin/users/${userId}/chat/${threadId}`
    )
  },

  getUserSocial(userId: string) {
    return adminRequest<
      Pick<
        UserDetailBundle,
        "friends" | "pendingSent" | "pendingReceived" | "notifications" | "sessions" | "pushTokens"
      >
    >(`/admin/users/${userId}/social`)
  },

  fileUserReport(userId: string, reason: string) {
    return adminRequest<{
      reportId: string
      createdAt: string
      status: string
      reason: string
      totalReports: number
      warningIssued: boolean
      userBanned: boolean
    }>(`/admin/users/${userId}/report`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    })
  },

  issueUserWarning(userId: string, reason?: string) {
    return adminRequest<{
      userId: string
      accountState: string
      moderationWarningCount: number
      moderationConsecutiveWarningCount: number
      userBanned: boolean
      reason: string | null
    }>(`/admin/users/${userId}/warning`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    })
  },

  hideUser(userId: string, reason?: string) {
    return adminRequest<{
      userId: string
      accountState: string
      profileHiddenAt: string | null
      reason: string | null
    }>(`/admin/users/${userId}/shadowban`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    })
  },

  unhideUser(userId: string) {
    return adminRequest<{ userId: string; accountState: string }>(
      `/admin/users/${userId}/unban`,
      { method: "POST" }
    )
  },

  banUser(userId: string, reason?: string) {
    return adminRequest<{
      userId: string
      accountState: string
      moderationWarningCount: number
      reason: string | null
    }>(`/admin/users/${userId}/ban`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    })
  },

  unbanUser(userId: string) {
    return adminRequest<{ userId: string; accountState: string }>(
      `/admin/users/${userId}/unban`,
      { method: "POST" }
    )
  },

  deleteUser(userId: string) {
    return adminRequest<{
      userId: string
      deletedAt?: string
      alreadyDeleted?: boolean
    }>(`/admin/users/${userId}/delete`, {
      method: "POST",
    })
  },

  grantPremium(userId: string, durationDays: number) {
    return adminRequest<{
      userId: string
      premiumStatus: string
      premiumPlanCode: string | null
      premiumExpiresAt: string | null
      isPremium: boolean
    }>(`/admin/users/${userId}/grant-premium`, {
      method: "POST",
      body: JSON.stringify({ durationDays }),
    })
  },

  removePremium(userId: string) {
    return adminRequest<{
      userId: string
      premiumStatus: string
      premiumPlanCode: string | null
      isPremium: boolean
    }>(`/admin/users/${userId}/remove-premium`, {
      method: "POST",
    })
  },

  grantBoostCredits(userId: string, amount: number) {
    return adminRequest<{
      userId: string
      remainingCredits: number
      granted: number
    }>(`/admin/users/${userId}/grant-boosts`, {
      method: "POST",
      body: JSON.stringify({ amount }),
    })
  },

  grantCommentCredits(userId: string, amount: number) {
    return adminRequest<{
      userId: string
      remainingPaidComments: number
      granted: number
    }>(`/admin/users/${userId}/grant-comments`, {
      method: "POST",
      body: JSON.stringify({ amount }),
    })
  },

  listReports(query: { contentType?: string; page?: number; limit?: number } = {}) {
    return adminRequest<{
      items: import("@/types").ReportQueueItem[]
      pagination: { page: number; limit: number; total: number; totalPages: number }
    }>(
      `/admin/reports${buildQuery({
        contentType: query.contentType && query.contentType !== "ALL" ? query.contentType : undefined,
        page: query.page,
        limit: query.limit,
      })}`
    )
  },

  getReportDetail(reportId: string) {
    return adminRequest<import("@/types").ReportDetailResponse>(`/admin/reports/${reportId}`)
  },

  dismissReport(reportId: string) {
    return adminRequest<{ dismissedReportId: string }>(`/admin/reports/${reportId}`, {
      method: "DELETE",
    })
  },

  getBroadcastAudienceSize(payload: { audience: string; city?: string }) {
    return adminRequest<{
      audience: string
      city: string | null
      estimatedRecipients: number
    }>("/admin/broadcast/audience-size", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },

  sendBroadcast(payload: {
    title: string
    body: string
    audience: string
  }) {
    return adminRequest<{
      broadcastId: string
      sentAt: string
      recipientsCount: number
      push: { attempted: number; successCount: number; failureCount: number }
    }>("/admin/broadcast", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },

  listBroadcastHistory(page = 1) {
    return adminRequest<{
      items: import("@/types").BroadcastRecord[]
      pagination: { page: number; limit: number; total: number; totalPages: number }
    }>(`/admin/broadcast/history?page=${page}&limit=25`)
  },

  listProducts() {
    return adminRequest<{ products: import("@/types").ProductConfiguration[] }>("/admin/products")
  },

  updateProducts(products: Array<Partial<import("@/types").ProductConfiguration> & { packCode: string }>) {
    return adminRequest<{ products: import("@/types").ProductConfiguration[] }>("/admin/products", {
      method: "PATCH",
      body: JSON.stringify({ products }),
    })
  },
}

export function persistLoginSession(session: AdminLoginResponse) {
  writeStoredSession({
    accessToken: session.accessToken,
    expiresAt: session.expiresAt,
    admin: session.admin,
  })
}
