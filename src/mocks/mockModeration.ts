import type { PhotoModerationQueueItem, VerificationReviewItem } from "@/types"
import { USER_IDS, PHOTO_URLS, daysAgo, hoursAgo } from "./helpers"

export const mockPhotoModerationQueue: PhotoModerationQueueItem[] = [
  {
    photo: {
      id: "mq1",
      userId: USER_IDS.nina,
      photoOrder: 2,
      isPrimary: false,
      s3Key: "users/nina/photo-2.webp",
      imageUrl: PHOTO_URLS.nina1,
      moderationStatus: "PENDING_MODERATION",
      uploadedAt: hoursAgo(3),
      deletedAt: null,
    },
    user: {
      id: USER_IDS.nina,
      name: "Nina Roy",
      ageYears: 24,
      genderMain: "Woman",
      accountState: "ACTIVE",
    },
    otherApprovedPhotos: [
      {
        id: "mq1-approved",
        userId: USER_IDS.nina,
        photoOrder: 1,
        isPrimary: true,
        s3Key: "users/nina/photo-1.webp",
        imageUrl: PHOTO_URLS.priya2,
        moderationStatus: "APPROVED",
        uploadedAt: daysAgo(20),
        deletedAt: null,
      },
    ],
  },
  {
    photo: {
      id: "mq2",
      userId: USER_IDS.karan,
      photoOrder: 1,
      isPrimary: true,
      s3Key: "users/karan/photo-1.webp",
      imageUrl: PHOTO_URLS.arjun1,
      moderationStatus: "PENDING_GENDER_REVIEW",
      uploadedAt: hoursAgo(1),
      deletedAt: null,
    },
    user: {
      id: USER_IDS.karan,
      name: "Karan Singh",
      ageYears: 28,
      genderMain: "Man",
      accountState: "PENDING_CAPTCHA",
    },
    otherApprovedPhotos: [],
  },
  {
    photo: {
      id: "mq3",
      userId: USER_IDS.aisha,
      photoOrder: 3,
      isPrimary: false,
      s3Key: "users/aisha/photo-3.webp",
      imageUrl: PHOTO_URLS.aisha1,
      moderationStatus: "FAILED_MODERATION",
      uploadedAt: daysAgo(2),
      deletedAt: null,
    },
    user: {
      id: USER_IDS.aisha,
      name: "Aisha Khan",
      ageYears: 27,
      genderMain: "Woman",
      accountState: "HIDDEN_BY_MODERATION",
    },
    otherApprovedPhotos: [
      {
        id: "mq3-approved",
        userId: USER_IDS.aisha,
        photoOrder: 1,
        isPrimary: true,
        s3Key: "users/aisha/photo-1.webp",
        imageUrl: PHOTO_URLS.aisha1,
        moderationStatus: "APPROVED",
        uploadedAt: daysAgo(80),
        deletedAt: null,
      },
    ],
  },
]

export const mockVerificationReviewQueue: VerificationReviewItem[] = [
  {
    user: {
      id: USER_IDS.nina,
      name: "Nina Roy",
      ageYears: 24,
      genderMain: "Woman",
      accountState: "ACTIVE",
      verificationSelfieUrl: PHOTO_URLS.selfie,
    },
    profilePhotos: [
      {
        id: "vr1",
        userId: USER_IDS.nina,
        photoOrder: 1,
        isPrimary: true,
        s3Key: "users/nina/photo-1.webp",
        imageUrl: PHOTO_URLS.nina1,
        moderationStatus: "APPROVED",
        uploadedAt: daysAgo(20),
        deletedAt: null,
      },
    ],
    latestSession: {
      id: "vs-nina",
      awsSessionId: "aws-liveness-nina-001",
      status: "SUCCEEDED",
      livenessConfidence: 91.2,
      failureReason: null,
      createdAt: hoursAgo(5),
    },
  },
]

