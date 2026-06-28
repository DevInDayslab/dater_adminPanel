import { UserDetailLink } from "@/components/users/UserDetailLink"
import { AccountStateBadge } from "@/components/shared/AccountStateBadge"
import { SectionCard } from "@/components/shared/FieldGrid"
import {
  UserModerationActions,
  UserModerationWarningChips,
} from "@/components/users/UserModerationActions"
import { formatDateTime, normalizeAdminFiledReport } from "@/lib/formatters"
import type { UserTrustResponse } from "@/lib/api"
import type { UserProfileDetail, UserReport } from "@/types"

type UserTrustTabProps = {
  userId: string
  trust: UserTrustResponse
  profile: Pick<
    UserProfileDetail,
    | "id"
    | "name"
    | "accountState"
    | "moderationWarningCount"
    | "moderationConsecutiveWarningCount"
    | "moderationWarningsAcknowledged"
  >
}

export function UserTrustTab({ userId, trust, profile }: UserTrustTabProps) {
  const { reportsAgainst, reportsFiled, blocks } = trust

  return (
    <div className="space-y-6">
      <SectionCard title="Account state panel">
        <div className="space-y-4">
          <AccountStateBadge state={profile.accountState} size="lg" />
          <UserModerationActions userId={userId} profile={profile} showIssueWarning={false} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-[10px] border border-border-card p-3">
              <p className="text-xs text-text-muted">Total warnings</p>
              <p className="mt-1 text-lg font-medium">{profile.moderationWarningCount}</p>
            </div>
            <div className="rounded-[10px] border border-border-card p-3">
              <p className="text-xs text-text-muted">Consecutive warnings</p>
              <p className="mt-1 text-lg font-medium">{profile.moderationConsecutiveWarningCount}</p>
            </div>
            <div className="rounded-[10px] border border-border-card p-3">
              <p className="text-xs text-text-muted">Acknowledged</p>
              <p className="mt-1 text-lg font-medium">{profile.moderationWarningsAcknowledged}</p>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Issue warning</p>
            <UserModerationWarningChips userId={userId} profile={profile} />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Reports against this user">
        <ReportTable reports={reportsAgainst} emptyMessage="No reports in this view." />
      </SectionCard>

      <SectionCard title="Reports filed by this user">
        <ReportTable reports={reportsFiled} emptyMessage="No reports filed by this user." />
      </SectionCard>

      <SectionCard title="Blocks">
        {blocks.length ? (
          <div className="admin-table-scroll">
            <table className="min-w-[520px] w-full border-collapse">
              <thead>
                <tr className="bg-surface-input">
                  <th className="px-3 py-2 text-left text-xs text-text-muted">Blocker</th>
                  <th className="px-3 py-2 text-left text-xs text-text-muted">Blocked</th>
                  <th className="px-3 py-2 text-left text-xs text-text-muted">Created</th>
                </tr>
              </thead>
              <tbody>
                {blocks.map((block) => (
                  <tr key={`${block.blockerId}-${block.blockedId}`} className="border-t border-border-subtle">
                    <td className="px-3 py-2 text-sm">{block.blockerName}</td>
                    <td className="px-3 py-2 text-sm">{block.blockedName}</td>
                    <td className="px-3 py-2 text-sm">{formatDateTime(block.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-text-secondary">No block records for this user.</p>
        )}
      </SectionCard>
    </div>
  )
}

function ReportTable({
  reports,
  emptyMessage,
}: {
  reports: UserReport[]
  emptyMessage: string
}) {
  return reports.length ? (
    <div className="admin-table-scroll">
      <table className="min-w-[720px] w-full border-collapse">
        <thead>
          <tr className="bg-surface-input">
            {["Created", "Reporter", "Type", "Reason"].map((col) => (
              <th key={col} className="px-3 py-2 text-left text-xs text-text-muted">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => {
            const normalized = normalizeAdminFiledReport(report)
            return (
            <tr key={report.id} className="border-t border-border-subtle">
              <td className="px-3 py-2 text-sm">{formatDateTime(normalized.createdAt)}</td>
              <td className="px-3 py-2 text-sm">
                {normalized.filedByAdmin || !normalized.reporterId ? (
                  <span>{normalized.reporterName}</span>
                ) : (
                  <UserDetailLink
                    userId={normalized.reporterId}
                    className="text-black underline-offset-2 hover:underline"
                  >
                    {normalized.reporterName}
                  </UserDetailLink>
                )}
              </td>
              <td className="px-3 py-2 text-sm">{normalized.contentType}</td>
              <td className="px-3 py-2 text-sm">{normalized.reason}</td>
            </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  ) : (
    <p className="text-sm text-text-secondary">{emptyMessage}</p>
  )
}
