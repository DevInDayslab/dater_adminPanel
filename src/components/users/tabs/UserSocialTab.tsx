import { AccountStateBadge } from "@/components/shared/AccountStateBadge"
import { SectionCard } from "@/components/shared/FieldGrid"
import { UserAvatar } from "@/components/users/UserAvatar"
import { UserDetailLink } from "@/components/users/UserDetailLink"
import type {
  Friendship,
  NotificationEvent,
  PendingInteraction,
  PushToken,
  UserSession,
} from "@/types"
import { formatDateTime, formatIpAddress } from "@/lib/formatters"

type UserSocialTabProps = {
  friends: Friendship[]
  pendingSent: PendingInteraction[]
  pendingReceived: PendingInteraction[]
  notifications: NotificationEvent[]
  sessions: UserSession[]
  pushTokens: PushToken[]
}

export function UserSocialTab({
  friends,
  pendingSent,
  pendingReceived,
  notifications,
  sessions,
  pushTokens,
}: UserSocialTabProps) {
  return (
    <div className="space-y-6">
      <SectionCard title="Friends">
        {friends.length ? (
          <div className="space-y-3">
            {friends.map((friend) => (
              <div
                key={friend.friendId}
                className="flex flex-col gap-3 rounded-[10px] border border-border-card p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <UserAvatar src={null} name={friend.friendName} className="size-12" />
                  <div className="min-w-0">
                    <p className="font-medium">{friend.friendName}</p>
                    <p className="mt-1 font-mono text-xs text-text-meta">{friend.friendId}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <AccountStateBadge state={friend.friendAccountState} />
                      <span className="text-xs text-text-meta">
                        Friends since {formatDateTime(friend.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <UserDetailLink
                  userId={friend.friendId}
                  className="inline-flex h-8 items-center justify-center rounded-md border border-border-input bg-white px-3 text-sm font-medium hover:bg-surface-hover"
                >
                  View profile
                </UserDetailLink>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-secondary">No friends.</p>
        )}
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <InteractionTable title="Pending requests sent" rows={pendingSent} />
        <InteractionTable title="Pending requests received" rows={pendingReceived} />
      </div>

      <SectionCard title="Notifications inbox (last 50)">
        {notifications.length ? (
          <div className="admin-table-scroll">
            <table className="min-w-[520px] w-full border-collapse">
              <thead>
                <tr className="bg-surface-input">
                  {["Event", "Actor", "Created"].map((col) => (
                    <th key={col} className="px-3 py-2 text-left text-xs text-text-muted">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {notifications.map((event) => (
                  <tr key={event.id} className="border-t border-border-subtle">
                    <td className="px-3 py-2 text-sm">{event.eventType}</td>
                    <td className="px-3 py-2 text-sm">
                      {event.actorUserId ? (
                        <UserDetailLink userId={event.actorUserId} className="hover:underline">
                          {event.actorName}
                        </UserDetailLink>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-3 py-2 text-sm">{formatDateTime(event.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-text-secondary">No notifications.</p>
        )}
      </SectionCard>

      <SectionCard
        title="Login sessions"
        description="Revoked means the session was ended early by logout, password change, or an admin revoke — the user must sign in again on that device."
      >
        {sessions.length ? (
          <div className="admin-table-scroll">
            <table className="min-w-[760px] w-full border-collapse">
              <thead>
                <tr className="bg-surface-input">
                  {["Device", "IP", "Last seen", "Expires", "Revoked at"].map((col) => (
                    <th key={col} className="px-3 py-2 text-left text-xs text-text-muted">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.id} className="border-t border-border-subtle">
                    <td className="px-3 py-2 text-sm">{session.deviceId ?? "—"}</td>
                    <td className="px-3 py-2 text-sm">{formatIpAddress(session.ipAddress)}</td>
                    <td className="px-3 py-2 text-sm">{formatDateTime(session.lastSeenAt)}</td>
                    <td className="px-3 py-2 text-sm">{formatDateTime(session.expiresAt)}</td>
                    <td className="px-3 py-2 text-sm">
                      {session.revokedAt ? formatDateTime(session.revokedAt) : "Active"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-text-secondary">No login sessions.</p>
        )}
      </SectionCard>

      <SectionCard title="Push tokens">
        {pushTokens.length ? (
          <div className="admin-table-scroll">
            <table className="min-w-[520px] w-full border-collapse">
              <thead>
                <tr className="bg-surface-input">
                  {["Platform", "Device", "Active", "Last Seen"].map((col) => (
                    <th key={col} className="px-3 py-2 text-left text-xs text-text-muted">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pushTokens.map((token) => (
                  <tr key={token.id} className="border-t border-border-subtle">
                    <td className="px-3 py-2 text-sm">{token.platform}</td>
                    <td className="px-3 py-2 text-sm">{token.deviceId ?? "—"}</td>
                    <td className="px-3 py-2 text-sm">{token.isActive ? "Yes" : "No"}</td>
                    <td className="px-3 py-2 text-sm">{formatDateTime(token.lastSeenAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-text-secondary">No push tokens.</p>
        )}
      </SectionCard>
    </div>
  )
}

function InteractionTable({
  title,
  rows,
}: {
  title: string
  rows: PendingInteraction[]
}) {
  return (
    <SectionCard title={title}>
      {rows.length ? (
        <div className="admin-table-scroll">
          <table className="min-w-[480px] w-full border-collapse">
            <thead>
              <tr className="bg-surface-input">
                {["User", "Type", "Comment", "Sent"].map((col) => (
                  <th key={col} className="px-3 py-2 text-left text-xs text-text-muted">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-border-subtle">
                  <td className="px-3 py-2 text-sm">
                    <UserDetailLink userId={row.targetUserId} className="hover:underline">
                      {row.targetUserName}
                    </UserDetailLink>
                  </td>
                  <td className="px-3 py-2 text-sm">{row.interactionType}</td>
                  <td className="px-3 py-2 text-sm">{row.commentText ?? "—"}</td>
                  <td className="px-3 py-2 text-sm">{formatDateTime(row.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-text-secondary">None.</p>
      )}
    </SectionCard>
  )
}
