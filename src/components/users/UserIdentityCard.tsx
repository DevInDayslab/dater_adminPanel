import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import type { UserProfileDetail } from "@/types"
import { UserAvatar } from "@/components/users/UserAvatar"
import { AccountStateBadge } from "@/components/shared/AccountStateBadge"
import { PremiumBadge } from "@/components/shared/PremiumBadge"
import { VerifiedIcon } from "@/components/shared/VerifiedIcon"
import { FileUserReportAction } from "@/components/users/FileUserReportAction"
import { UserEntitlementsActions } from "@/components/users/UserEntitlementsActions"
import { UserModerationActions } from "@/components/users/UserModerationActions"
import { formatRelativeTime, maskPhone, truncateUuid } from "@/lib/formatters"
import { useAdminStore } from "@/stores/adminStore"

type UserIdentityCardProps = {
  userId: string
  profile: UserProfileDetail
  totalReports: number
}

export function UserIdentityCard({ userId, profile, totalReports }: UserIdentityCardProps) {
  const [phoneRevealed, setPhoneRevealed] = useState(false)
  const pushToast = useAdminStore((s) => s.pushToast)

  const revealPhone = () => {
    setPhoneRevealed(true)
    pushToast("Phone number revealed.")
  }

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 gap-4">
          <UserAvatar
            src={profile.primaryPhotoUrl}
            name={profile.name}
            className="size-16"
          />
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[22px] leading-none">
                {profile.name ?? "Unnamed"}
                {profile.ageYears ? `, ${profile.ageYears}` : ""}
              </h2>
              {profile.genderMain ? (
                <span className="text-sm text-text-secondary">{profile.genderMain}</span>
              ) : null}
            </div>
            {profile.livingInCity ? (
              <p className="text-sm text-text-secondary">{profile.livingInCity}</p>
            ) : null}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <button
                type="button"
                onClick={phoneRevealed ? undefined : revealPhone}
                className="inline-flex items-center gap-1 text-black"
              >
                {phoneRevealed ? profile.phoneE164 : maskPhone(profile.phoneE164)}
                {!phoneRevealed ? <Eye className="size-3.5 text-text-muted" /> : <EyeOff className="size-3.5 text-text-muted" />}
              </button>
              <span className="text-text-muted">·</span>
              <span className="font-mono text-xs text-text-meta">{truncateUuid(profile.id)}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <AccountStateBadge state={profile.accountState} size="lg" />
              <VerifiedIcon verified={profile.isVerified} />
              <PremiumBadge status={profile.premiumStatus} />
            </div>
            <p className="text-xs text-text-meta">
              {profile.moderationWarningCount} warning{profile.moderationWarningCount === 1 ? "" : "s"} ·{" "}
              {totalReports} report{totalReports === 1 ? "" : "s"}
            </p>
            <p className="text-xs text-text-meta">
              Joined {formatRelativeTime(profile.createdAt)} · Last active {formatRelativeTime(profile.lastActiveAt)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-start gap-2">
          <UserModerationActions userId={userId} profile={profile} size="sm" />
          <FileUserReportAction userId={userId} />
        </div>
      </div>

      <div className="mt-4 border-t border-brand/15 pt-4">
        <UserEntitlementsActions
          userId={userId}
          premiumStatus={profile.premiumStatus}
          layout="inline"
        />
      </div>
    </div>
  )
}
