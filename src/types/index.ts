import type {
  AccountState,
  ChatMessageType,
  ChatRelationshipState,
  ChatSenderType,
  ChatThreadType,
  GenderMain,
  InteractionType,
  ModerationActionType,
  ModerationStatus,
  NotificationEventType,
  PremiumPlanCode,
  PremiumStatus,
  PurchaseItemType,
  ReportContentType,
  ReportStatus,
  RequestStatus,
  StoryAudience,
  StoryMediaType,
  VerificationSessionStatus,
  LivingInCityMode,
} from "./enums"

export type UserListItem = {
  id: string
  name: string | null
  phoneE164: string | null
  ageYears: number | null
  genderMain: GenderMain | null
  accountState: AccountState
  premiumStatus: PremiumStatus
  isVerified: boolean
  createdAt: string
  lastActiveAt: string
  primaryPhotoUrl: string | null
  reportsAgainstCount: number
}

export type UserPhoto = {
  id: string
  userId: string
  photoOrder: number
  isPrimary: boolean
  s3Key: string | null
  imageUrl: string
  moderationStatus: ModerationStatus
  uploadedAt: string
  deletedAt: string | null
}

export type UserWrittenPrompt = {
  id: string
  promptOrder: number
  promptQuestion: string
  promptAnswer: string
}

export type UserProfileDetail = {
  id: string
  phoneCountryCode: string
  phoneNumber: string
  phoneE164: string | null
  isPhoneVerified: boolean
  name: string | null
  ageYears: number | null
  dateOfBirth: string | null
  gender: string | null
  genderMain: GenderMain | null
  showGenderOnProfile: boolean
  maritalStatus: string | null
  heightInches: number | null
  drinking: string | null
  smoking: string | null
  exercise: string | null
  religion: string | null
  education: string | null
  starSign: string | null
  kids: string | null
  politicalLeanings: string | null
  pets: string | null
  bio: string | null
  presetMessage: string | null
  ethnicity: string | null
  occupationJobTitle: string | null
  occupationCompany: string | null
  educationInstitutionName: string | null
  educationPassingYear: number | null
  livingInCity: string | null
  livingInCityMode: LivingInCityMode | null
  homeTownCity: string | null
  locationLat: number | null
  locationLng: number | null
  locationGranted: boolean
  onboardingStep: string
  onboardingCompletedAt: string | null
  profileCompletionPercentage: number
  accountState: AccountState
  premiumStatus: PremiumStatus
  premiumPlanCode: PremiumPlanCode | null
  premiumStartedAt: string | null
  premiumExpiresAt: string | null
  isVerified: boolean
  verifiedAt: string | null
  verificationSelfieUrl: string | null
  moderationWarningCount: number
  moderationConsecutiveWarningCount: number
  moderationWarningsAcknowledged: number
  hideMyName: boolean
  notificationsGranted: boolean
  accountCreatedIpAddress: string | null
  accountCreatedDeviceId: string | null
  accountCreatedUserAgent: string | null
  consentSource: string | null
  ageAgreementTimestamp: string | null
  beKindAcceptedAt: string | null
  termsAcceptedAt: string | null
  privacyAcceptedAt: string | null
  createdAt: string
  updatedAt: string
  lastActiveAt: string
  lastLoginAt: string | null
  lastLogoutAt: string | null
  profileUpdatedAt: string
  pausedUntil: string | null
  underageUntil: string | null
  profileHiddenAt: string | null
  deletedAt: string | null
  datingPreferences: string[]
  lookingFor: string[]
  interests: string[]
  pronouns: string[]
  languages: string[]
  genderMoreOptions: string[]
  writtenPrompts: UserWrittenPrompt[]
  primaryPhotoUrl: string | null
}

export type UserFiltersDetail = {
  distancePrefKm: number
  ageMin: number
  ageMax: number
  minHeightInches: number | null
  maxHeightInches: number | null
  expandAgeRange: boolean
  expandDistance: boolean
  onlyVerifiedProfiles: boolean
  preferredLocationCity: string | null
  showOtherPeopleIfRunOut: boolean
  preferredGenders: string[]
  languages: string[]
  maritalStatuses: string[]
  lookingFor: string[]
  drinking: string[]
  smoking: string[]
  exercise: string[]
  religion: string[]
  education: string[]
  starSign: string[]
  kids: string[]
  political: string[]
  pets: string[]
  ethnicity: string[]
  pronouns: string[]
}

export type VerificationSession = {
  id: string
  awsSessionId: string
  status: VerificationSessionStatus
  livenessConfidence: number | null
  failureReason: string | null
  createdAt: string
}

export type ModerationActionLog = {
  id: string
  actionType: ModerationActionType
  reason: string | null
  performedByAdminName: string
  createdAt: string
}

export type UserReport = {
  id: string
  reporterId: string | null
  reporterName: string
  reportedId: string
  reportedName: string
  contentType: ReportContentType
  reason: string
  status: ReportStatus
  createdAt: string
  chatThreadId: string | null
  storyId: string | null
  filedByAdmin?: boolean
}

export type UserBlock = {
  blockerId: string
  blockerName: string
  blockedId: string
  blockedName: string
  createdAt: string
}

export type StoryRecord = {
  id: string
  mediaType: StoryMediaType
  mediaUrl: string
  audience: StoryAudience
  createdAt: string
  expiresAt: string
  deletedAt: string | null
  viewCount: number
  likeCount: number
  commentCount: number
  isActive: boolean
}

export type ChatThreadSummary = {
  id: string
  otherParticipantId: string
  otherParticipantName: string
  threadType: ChatThreadType
  lastMessageAt: string
  relationshipState: ChatRelationshipState
  isUnlocked: boolean
}

export type ChatMessage = {
  id: string
  senderUserId: string
  senderType: ChatSenderType
  messageText: string | null
  messageType: ChatMessageType
  createdAt: string
  deletedAt: string | null
  replyToMessageId: string | null
  replyPreview: string | null
  isReported: boolean
}

export type Friendship = {
  friendId: string
  friendName: string
  friendAccountState: AccountState
  createdAt: string
}

export type PendingInteraction = {
  id: string
  targetUserId: string
  targetUserName: string
  interactionType: InteractionType
  requestStatus: RequestStatus
  commentText: string | null
  createdAt: string
}

export type NotificationEvent = {
  id: string
  eventType: NotificationEventType
  actorName: string | null
  actorUserId: string | null
  isRead: boolean
  createdAt: string
}

export type UserSession = {
  id: string
  deviceId: string | null
  ipAddress: string | null
  userAgent: string | null
  lastSeenAt: string
  expiresAt: string
  revokedAt: string | null
}

export type PushToken = {
  id: string
  platform: "ANDROID" | "IOS"
  deviceId: string | null
  isActive: boolean
  lastSeenAt: string
}

export type UserPurchase = {
  id: string
  itemType: PurchaseItemType | string
  packCode: string | null
  amount: number
  quantity: number | null
  transactionId: string
  paymentStatus: "SUCCESS" | "PENDING" | string
  createdAt: string
}

export type BoostWallet = {
  remainingCredits: number
}

export type CommentWallet = {
  remainingPaidComments: number
}

export type BoostActivation = {
  id: string
  activatedCount: number
  startedAt: string
  expiresAt: string
  isActive?: boolean
}

export type ChatUnlockEvent = {
  id: string
  threadId: string
  otherParticipantName: string
  unlockedAt: string
}

export type DailyProfileViewUsage = {
  usageDate: string
  profileViewCount: number
  freeTierLimit: number
}

export type UserDetailBundle = {
  profile: UserProfileDetail
  photos: UserPhoto[]
  filters: UserFiltersDetail
  verificationSessions: VerificationSession[]
  moderationActions: ModerationActionLog[]
  reportsAgainst: UserReport[]
  reportsFiled: UserReport[]
  blocks: UserBlock[]
  activeStory: StoryRecord | null
  storyHistory: StoryRecord[]
  chatThreads: ChatThreadSummary[]
  chatMessagesByThread: Record<string, ChatMessage[]>
  friends: Friendship[]
  pendingSent: PendingInteraction[]
  pendingReceived: PendingInteraction[]
  notifications: NotificationEvent[]
  sessions: UserSession[]
  pushTokens: PushToken[]
  purchases: UserPurchase[]
  boostWallet: BoostWallet
  commentWallet: CommentWallet
  activeBoost: BoostActivation | null
  chatUnlocks: ChatUnlockEvent[]
  dailyProfileViewUsage: DailyProfileViewUsage
}

export type PhotoModerationQueueItem = {
  photo: UserPhoto
  user: Pick<UserProfileDetail, "id" | "name" | "ageYears" | "genderMain" | "accountState">
  otherApprovedPhotos: UserPhoto[]
}

export type VerificationReviewItem = {
  user: Pick<UserProfileDetail, "id" | "name" | "ageYears" | "genderMain" | "accountState" | "verificationSelfieUrl">
  profilePhotos: UserPhoto[]
  latestSession: VerificationSession
}

export type ReportQueueItem = UserReport & {
  reportedUserWarningCount: number
  reportedUserAccountState: AccountState
  storyPreviewUrl: string | null
  profilePreviewUrl: string | null
  reportedBio: string | null
}

export type ReportDetailContext =
  | { type: "CHAT"; messages: ChatMessage[] }
  | {
      type: "STORY"
      story: {
        id: string
        mediaUrl: string | null
        mediaType: string
        audience: string
        createdAt: string
      }
    }
  | { type: "PROFILE"; bio: string | null; profilePhotoUrl: string | null }
  | null

export type ReportDetailResponse = {
  report: ReportQueueItem
  context: ReportDetailContext
}

export type BroadcastRecord = {
  id: string
  title: string
  body: string
  targetAudience: string
  recipientsCount: number
  sentByAdminName: string
  sentAt: string
  deepLink: string | null
}

export type ProductConfiguration = {
  packCode: string
  category: "PREMIUM" | "BOOST" | "COMMENTS"
  quantity: number
  durationDays: number | null
  planCode: string | null
  displayTitle: string
  displayLabel: string
  pricePaise: number
  currency: string
  priceLabel: string
  buttonLabel: string
  badgeType: "MOST_POPULAR" | "SAVE" | null
  badgeText: string | null
  isDefault: boolean
  isActive: boolean
  sortOrder: number
  googlePlayProductId: string | null
  appleProductId: string | null
  updatedAt?: string | null
}

export type DashboardStats = {
  totalUsers: number
  dau: number
  mau: number
  premiumUsers: number
  pendingReports: number
  pendingPhotoReview: number
  deltas: {
    totalUsers: number
    dau: number
    mau: number
    premiumUsers: number
    pendingReports: number
    pendingPhotoReview: number
  }
}

export type GrowthDataPoint = {
  date: string
  newUsers: number
}

export type GenderBreakdownItem = {
  genderMain: GenderMain
  count: number
  percentage: number
}

export type AccountStateBreakdownItem = {
  accountState: AccountState
  count: number
}

export type RevenueDailyPoint = {
  date: string
  subscriptions: number
  boosts: number
  comments: number
  chatUnlocks: number
}

export type RevenueSummary = {
  totalRevenue: number
  subscriptionsSold: number
  boostsSold: number
  commentPacksSold: number
  chatUnlocksSold: number
}

export type TopBuyer = {
  userId: string
  userName: string
  totalPurchases: number
  totalSpend: number
  premiumStatus: PremiumStatus
  accountState: AccountState
}

export type PackCodeBreakdownItem = {
  packCode: string
  count: number
}

export type PremiumPlanMixItem = {
  planCode: string
  count: number
  percentage: number
}

export type OnboardingFunnelItem = {
  onboardingStep: string
  count: number
}

export type VerificationStats = {
  verifiedCount: number
  unverifiedCount: number
  successRate: number
  totalAttempts: number
}

export type DashboardBundle = {
  stats: DashboardStats
  growth: GrowthDataPoint[]
  genderBreakdown: GenderBreakdownItem[]
  accountStateBreakdown: AccountStateBreakdownItem[]
  revenueDaily: RevenueDailyPoint[]
  revenueSummary: RevenueSummary
  onboardingFunnel: OnboardingFunnelItem[]
  verificationStats: VerificationStats
}
