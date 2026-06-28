import { useState } from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/shared/FieldGrid"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import {
  useBroadcastAudienceSize,
  useBroadcastHistory,
  useSendBroadcast,
} from "@/hooks/useBroadcast"
import {
  BROADCAST_AUDIENCE_OPTIONS,
  broadcastAudienceLabel,
  DATER_APP_ICON_URL,
  type BroadcastAudienceValue,
} from "@/lib/broadcastLabels"
import { formatDateTime } from "@/lib/formatters"
import { canAccessBroadcast, useAdminStore } from "@/stores/adminStore"

function NotificationPreview({ title, body }: { title: string; body: string }) {
  return (
    <div className="mx-auto max-w-[320px] rounded-[20px] border border-border-card bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      <div className="mb-3 flex items-center gap-2">
        <img
          src={DATER_APP_ICON_URL}
          alt=""
          className="size-8 rounded-md object-cover"
        />
        <div>
          <p className="text-xs font-medium">Dater</p>
          <p className="text-[11px] text-text-muted">now</p>
        </div>
      </div>
      <p className="text-sm font-medium text-black">{title || "Notification title"}</p>
      <p className="mt-1 text-sm text-text-secondary">{body || "Notification body preview"}</p>
    </div>
  )
}

export function NotificationsPage() {
  const admin = useAdminStore((s) => s.admin)
  const pushToast = useAdminStore((s) => s.pushToast)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [audience, setAudience] = useState<BroadcastAudienceValue>("ALL_USERS")
  const [historyPage, setHistoryPage] = useState(1)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const audienceQuery = useBroadcastAudienceSize(audience)
  const historyQuery = useBroadcastHistory(historyPage)
  const sendBroadcast = useSendBroadcast()

  const audienceSize = audienceQuery.data?.estimatedRecipients ?? 0
  const audienceLabel =
    BROADCAST_AUDIENCE_OPTIONS.find((option) => option.value === audience)?.label ?? "All users"

  const canSend = Boolean(title.trim() && body.trim() && !sendBroadcast.isPending)

  if (!admin || !canAccessBroadcast(admin.role)) {
    return (
      <div className="admin-card p-8 text-center text-sm text-text-secondary">
        Broadcast tools are restricted to admin accounts.
      </div>
    )
  }

  const handleSend = async () => {
    try {
      const result = await sendBroadcast.mutateAsync({
        title: title.trim(),
        body: body.trim(),
        audience,
      })
      setConfirmOpen(false)
      setTitle("")
      setBody("")
      setAudience("ALL_USERS")
      pushToast(
        `Broadcast sent to ${result.recipientsCount.toLocaleString()} user${result.recipientsCount === 1 ? "" : "s"}.`
      )
    } catch (error) {
      pushToast(error instanceof Error ? error.message : "Failed to send broadcast.")
    }
  }

  const historyItems = historyQuery.data?.items ?? []
  const historyPagination = historyQuery.data?.pagination

  return (
    <div className="space-y-8">
      <PageHeader
        title="Broadcast"
        description="Send push notifications to all users or a targeted audience."
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="Compose broadcast">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                maxLength={50}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="mt-1 h-10 rounded-[14px]"
              />
              <p className="mt-1 text-right text-[11px] text-text-meta">{title.length}/50</p>
            </div>
            <div>
              <Label htmlFor="body">Body</Label>
              <Textarea
                id="body"
                maxLength={150}
                value={body}
                onChange={(event) => setBody(event.target.value)}
                className="mt-1 min-h-[120px] rounded-[14px]"
              />
              <p className="mt-1 text-right text-[11px] text-text-meta">{body.length}/150</p>
            </div>
            <div>
              <Label>Target audience</Label>
              <Select
                value={audience}
                onValueChange={(value) => value && setAudience(value as BroadcastAudienceValue)}
              >
                <SelectTrigger className="mt-1 h-10 rounded-[14px]">
                  <SelectValue placeholder={audienceLabel}>{audienceLabel}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {BROADCAST_AUDIENCE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setConfirmOpen(true)} disabled={!canSend}>
              Send
            </Button>
          </div>
        </SectionCard>

        <SectionCard title="Preview">
          <NotificationPreview title={title} body={body} />
          <p className="mt-4 text-sm text-text-secondary">
            Estimated recipients:{" "}
            {audienceQuery.isLoading ? (
              <Skeleton className="inline-block h-4 w-12 align-middle" />
            ) : audienceQuery.isError ? (
              <span className="text-[#FD1C1C]">Unable to estimate</span>
            ) : (
              <span className="font-medium text-black">{audienceSize.toLocaleString()}</span>
            )}
          </p>
          <p className="mt-1 text-xs text-text-muted">
            Users with an active push token on a device — not total registered users.
          </p>
        </SectionCard>
      </div>

      <SectionCard title="Broadcast history">
        {historyQuery.isError ? (
          <p className="text-sm text-[#FD1C1C]">Unable to load broadcast history.</p>
        ) : (
          <>
            <div className="admin-table-scroll">
              <table className="min-w-[760px] w-full border-collapse">
                <thead>
                  <tr className="bg-surface-input">
                    {["Sent", "Title", "Body", "Audience", "Recipients", "Sent by"].map((col) => (
                      <th key={col} className="px-3 py-2 text-left text-xs text-text-muted">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {historyQuery.isLoading ? (
                    Array.from({ length: 4 }).map((_, index) => (
                      <tr key={index} className="border-t border-border-subtle">
                        {Array.from({ length: 6 }).map((__, cellIndex) => (
                          <td key={cellIndex} className="px-3 py-2">
                            <Skeleton className="h-4 w-full max-w-[120px]" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : historyItems.length ? (
                    historyItems.map((row) => (
                      <tr key={row.id} className="border-t border-border-subtle">
                        <td className="px-3 py-2 text-sm">{formatDateTime(row.sentAt)}</td>
                        <td className="px-3 py-2 text-sm">{row.title}</td>
                        <td className="max-w-[240px] truncate px-3 py-2 text-sm">{row.body}</td>
                        <td className="px-3 py-2 text-sm">
                          {broadcastAudienceLabel(row.targetAudience)}
                        </td>
                        <td className="px-3 py-2 text-sm">
                          {row.recipientsCount.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-sm">{row.sentByAdminName}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-3 py-10 text-center text-sm text-text-secondary">
                        No broadcasts sent yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {historyPagination && historyPagination.totalPages > 1 ? (
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-border-subtle pt-3">
                <p className="text-sm text-text-secondary">
                  Page {historyPagination.page} of {historyPagination.totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={historyPage <= 1 || historyQuery.isFetching}
                    onClick={() => setHistoryPage(historyPage - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      historyPage >= historyPagination.totalPages || historyQuery.isFetching
                    }
                    onClick={() => setHistoryPage(historyPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            ) : null}
          </>
        )}
      </SectionCard>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="w-[min(32rem,calc(100%-2rem))] max-w-none gap-5 rounded-[12px] p-6 sm:max-w-none">
          <DialogHeader className="pr-8">
            <DialogTitle>Confirm broadcast</DialogTitle>
            <DialogDescription>
              This will send to {audienceSize.toLocaleString()} user
              {audienceSize === 1 ? "" : "s"} with active push notifications (
              {audienceLabel.toLowerCase()}).
            </DialogDescription>
          </DialogHeader>
          <NotificationPreview title={title} body={body} />
          <DialogFooter className="-mx-6 -mb-6 mt-2 border-t bg-transparent p-6 pt-4 sm:justify-end">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSend} disabled={!canSend}>
              {sendBroadcast.isPending ? "Sending…" : "Confirm send"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
