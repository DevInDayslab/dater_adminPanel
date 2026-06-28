import { useMemo } from "react"
import { ModerationStatusBadge } from "@/components/shared/ModerationStatusBadge"
import { SectionCard } from "@/components/shared/FieldGrid"
import type { UserPhoto, UserProfileDetail, VerificationSession } from "@/types"
import { formatDate, formatDateTime } from "@/lib/formatters"

type UserPhotosTabProps = {
  photos: UserPhoto[]
  profile: Pick<UserProfileDetail, "verificationSelfieUrl" | "isVerified">
  verificationSessions: VerificationSession[]
}

function groupDeletedPhotosByDate(photos: UserPhoto[]) {
  const groups = new Map<string, number>()
  for (const photo of photos) {
    if (!photo.deletedAt) continue
    const dateKey = formatDate(photo.deletedAt)
    groups.set(dateKey, (groups.get(dateKey) ?? 0) + 1)
  }
  return Array.from(groups.entries()).map(([date, count]) => ({ date, count }))
}

export function UserPhotosTab({ photos, profile, verificationSessions }: UserPhotosTabProps) {
  const activePhotos = useMemo(() => photos.filter((photo) => !photo.deletedAt), [photos])
  const deletedPhotos = useMemo(() => photos.filter((photo) => photo.deletedAt), [photos])
  const deletedByDate = useMemo(() => groupDeletedPhotosByDate(deletedPhotos), [deletedPhotos])

  return (
    <div className="space-y-6">
      <SectionCard title="Profile photos" description="Active and pending photos on this account.">
        {activePhotos.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {activePhotos.map((photo) => (
              <div
                key={photo.id}
                className="overflow-hidden rounded-[10px] border border-border-card"
              >
                {photo.imageUrl ? (
                  <img src={photo.imageUrl} alt="" className="aspect-[4/5] w-full object-cover" />
                ) : (
                  <div className="flex aspect-[4/5] w-full items-center justify-center bg-surface-input text-sm text-text-muted">
                    No image URL
                  </div>
                )}
                <div className="space-y-2 p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-text-muted">Order {photo.photoOrder}</span>
                    {photo.isPrimary ? (
                      <span className="text-xs font-medium text-black">Primary</span>
                    ) : null}
                    <ModerationStatusBadge status={photo.moderationStatus} />
                  </div>
                  <p className="text-xs text-text-meta">Uploaded {formatDateTime(photo.uploadedAt)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-secondary">No active photos.</p>
        )}

        {deletedPhotos.length ? (
          <div className="mt-4 rounded-[10px] border border-border-card bg-surface-input px-4 py-3 text-sm text-text-secondary">
            <p className="font-medium text-black">
              Total deleted photos — {deletedPhotos.length}
            </p>
            <ul className="mt-2 space-y-1">
              {deletedByDate.map(({ date, count }) => (
                <li key={date}>
                  {count} deleted on {date}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </SectionCard>

      <SectionCard title="Verification" description="Liveness selfie, approved photos, and session history.">
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-medium tracking-[0.12px] text-text-muted uppercase">
              Verification selfie
            </p>
            {profile.verificationSelfieUrl ? (
              <img
                src={profile.verificationSelfieUrl}
                alt=""
                className="aspect-[3/4] max-h-80 rounded-[10px] object-cover"
              />
            ) : (
              <div className="flex aspect-[3/4] max-h-80 items-center justify-center rounded-[10px] bg-surface-input text-sm text-text-muted">
                {profile.isVerified ? "No selfie on file" : "Verification not done"}
              </div>
            )}
          </div>
          <div>
            <p className="mb-2 text-xs font-medium tracking-[0.12px] text-text-muted uppercase">
              Approved profile photos
            </p>
            <div className="flex flex-wrap gap-2">
              {activePhotos
                .filter((p) => p.moderationStatus === "APPROVED")
                .map((photo) => (
                  <img
                    key={photo.id}
                    src={photo.imageUrl}
                    alt=""
                    className="size-24 rounded-md object-cover"
                  />
                ))}
              {!activePhotos.some((p) => p.moderationStatus === "APPROVED") ? (
                <p className="text-sm text-text-secondary">No approved photos.</p>
              ) : null}
            </div>
          </div>
        </div>

        {verificationSessions.length ? (
          <div className="mt-6 admin-table-scroll">
            <table className="min-w-[640px] w-full border-collapse text-left">
              <thead>
                <tr className="bg-surface-input">
                  {["Created", "Status", "Confidence", "Failure Reason", "AWS Session"].map((col) => (
                    <th key={col} className="px-3 py-2 text-xs font-medium text-text-muted">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {verificationSessions.map((session) => (
                  <tr key={session.id} className="border-t border-border-subtle">
                    <td className="px-3 py-2 text-sm">{formatDateTime(session.createdAt)}</td>
                    <td className="px-3 py-2 text-sm">{session.status}</td>
                    <td className="px-3 py-2 text-sm">
                      {session.livenessConfidence != null ? `${session.livenessConfidence}%` : "—"}
                    </td>
                    <td className="px-3 py-2 text-sm">{session.failureReason ?? "—"}</td>
                    <td className="px-3 py-2 font-mono text-xs">{session.awsSessionId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-sm text-text-secondary">No verification sessions.</p>
        )}
      </SectionCard>
    </div>
  )
}
