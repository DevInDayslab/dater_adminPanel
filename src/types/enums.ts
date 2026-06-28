// Enums and unions aligned with backend/sql schemas

export type AccountState =
  | "ACTIVE"
  | "PAUSED"
  | "PRIVACY_MODE"
  | "HIDDEN_BY_MODERATION"
  | "DELETED"
  | "BANNED"
  | "UNDERAGE_BLOCKED"
  | "PENDING_CAPTCHA"

export type PremiumStatus = "INACTIVE" | "ACTIVE" | "EXPIRED"

export type PremiumPlanCode =
  | "PREMIUM_DAY"
  | "PREMIUM_WEEK"
  | "PREMIUM_MONTH"
  | "PREMIUM_THREE_MONTHS"
  | "PREMIUM_SIX_MONTHS"

export type GenderMain = "Woman" | "Man" | "Nonbinary"

export type ModerationStatus =
  | "APPROVED"
  | "PENDING_MODERATION"
  | "FAILED_MODERATION"
  | "PENDING_GENDER_REVIEW"

export type ReportContentType = "PROFILE" | "STORY" | "CHAT"

/** DB enum: PENDING | RESOLVED. Admin UI also models workflow states from blueprint. */
export type ReportStatus = "PENDING" | "UNDER_REVIEW" | "RESOLVED" | "DISMISSED"

export type ModerationActionType =
  | "WARNING_ISSUED"
  | "STORY_REMOVED"
  | "CONTENT_REMOVED"
  | "PROFILE_HIDDEN"
  | "BAN_ISSUED"
  | "BAN_REVOKED"
  | "REPORT_RESOLVED"

export type PurchaseItemType = "UNLOCK_CHAT" | "BOOST" | "SUBSCRIPTION"

export type ChatThreadType = "DIRECT" | "ADMIN_DM"

export type ChatRelationshipState = "ACTIVE" | "CHAT_ENDED" | "DELETED_ACCOUNT" | "BLOCKED"

export type ChatMessageType = "TEXT" | "STORY_REPLY_REFERENCE" | "SYSTEM"

export type ChatSenderType = "USER" | "ADMIN_SYSTEM"

export type StoryMediaType = "IMAGE" | "VIDEO"

export type StoryAudience = "EVERYONE" | "FRIENDS_ONLY"

export type StoryInteractionType = "VIEW" | "LIKE" | "COMMENT"

export type NotificationEventType =
  | "REQUEST_SENT"
  | "REQUEST_ACCEPTED"
  | "REQUEST_COMMENT_SENT"
  | "REQUEST_IGNORED_SILENT"
  | "STORY_LIKED"
  | "STORY_COMMENTED"
  | "CHAT_MESSAGE"

export type InteractionType = "REQUEST" | "COMMENT_REQUEST" | "IGNORE" | "VIEWED"

export type RequestStatus = "PENDING" | "ACCEPTED" | "IGNORED"

export type AdminRole = "ADMIN" | "MODERATOR" | "SUPPORT"

export type TimeWindow = "7d" | "30d" | "6m" | "1y" | "all"

export type DashboardGrowthWindow = "7d" | "30d" | "90d"

export type BroadcastAudience =
  | "ALL_USERS"
  | "PREMIUM_ONLY"
  | "FREE_ONLY"
  | "ACTIVE_7D"
  | "CITY"

export type VerificationSessionStatus =
  | "CREATED"
  | "IN_PROGRESS"
  | "SUCCEEDED"
  | "FAILED"
  | "EXPIRED"

export type LivingInCityMode = "GPS" | "MANUAL"
