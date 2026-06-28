import { useState, type MouseEvent, type ReactNode } from "react"
import { ArrowLeft } from "lucide-react"
import { useSearchParams } from "react-router-dom"
import { PageHeader } from "@/components/layout/PageHeader"
import { UserDetailLink } from "@/components/users/UserDetailLink"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useDismissReport, useReportDetail, useReportsList } from "@/hooks/useReports"
import { formatDateTime, normalizeAdminFiledReport } from "@/lib/formatters"
import {
  DISMISS_REPORT_CONFIRM,
  DISMISS_REPORT_HINT,
  REPORT_TYPE_LABELS,
  reportTypeLabel,
} from "@/lib/reportLabels"
import { cn } from "@/lib/utils"
import type { ReportContentType } from "@/types/enums"
import type { ChatMessage, ReportDetailContext } from "@/types"
import { useAdminStore } from "@/stores/adminStore"

function FilterField({
  label,
  value,
  displayValue,
  onValueChange,
  children,
}: {
  label: string
  value: string
  displayValue: string
  onValueChange: (value: string) => void
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium tracking-[0.12px] text-text-muted uppercase">
        {label}
      </Label>
      <Select value={value} onValueChange={(next) => next && onValueChange(next)}>
        <SelectTrigger className="h-10 rounded-[14px]">
          <SelectValue placeholder={displayValue}>{displayValue}</SelectValue>
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </div>
  )
}

function ChatMessagesView({
  messages,
  reportedUserId,
}: {
  messages: ChatMessage[]
  reportedUserId: string
}) {
  if (!messages.length) {
    return <p className="text-sm text-text-secondary">No messages in this chat.</p>
  }

  return (
    <div className="max-h-[480px] space-y-3 overflow-y-auto rounded-[10px] border border-border-subtle p-4">
      {messages.map((message) => {
        const fromReportedUser = message.senderUserId === reportedUserId
        const deleted = Boolean(message.deletedAt)

        return (
          <div
            key={message.id}
            className={cn("flex", fromReportedUser ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-[14px] px-3 py-2 text-sm",
                fromReportedUser ? "bg-black text-white" : "border border-border-card bg-white text-black",
                deleted && "opacity-60"
              )}
            >
              {deleted ? (
                <span className="italic">Message deleted</span>
              ) : (
                <>
                  {message.replyPreview ? (
                    <p className="mb-1 border-l-2 border-border-subtle pl-2 text-xs opacity-80">
                      {message.replyPreview}
                    </p>
                  ) : null}
                  <p>{message.messageText}</p>
                </>
              )}
              <p
                className={cn(
                  "mt-1 text-[11px]",
                  fromReportedUser ? "text-white/70" : "text-text-meta"
                )}
              >
                {formatDateTime(message.createdAt)}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ReportContentSection({
  contentType,
  context,
  reportedUserId,
  fallback,
}: {
  contentType: ReportContentType
  context: ReportDetailContext
  reportedUserId: string
  fallback: {
    storyPreviewUrl: string | null
    profilePreviewUrl: string | null
    reportedBio: string | null
  }
}) {
  if (contentType === "CHAT") {
    const messages = context?.type === "CHAT" ? context.messages : []
    return (
      <div className="space-y-2">
        <p className="text-xs font-medium tracking-[0.12px] text-text-muted uppercase">Chat</p>
        <ChatMessagesView messages={messages} reportedUserId={reportedUserId} />
      </div>
    )
  }

  if (contentType === "STORY") {
    const story = context?.type === "STORY" ? context.story : null
    const mediaUrl = story?.mediaUrl ?? fallback.storyPreviewUrl

    return (
      <div className="space-y-2">
        <p className="text-xs font-medium tracking-[0.12px] text-text-muted uppercase">Story</p>
        {mediaUrl ? (
          story?.mediaType === "VIDEO" ? (
            <video
              src={mediaUrl}
              controls
              className="aspect-[3/4] w-full max-w-xs rounded-[10px] bg-black object-cover"
            />
          ) : (
            <img
              src={mediaUrl}
              alt=""
              className="aspect-[3/4] w-full max-w-xs rounded-[10px] object-cover"
            />
          )
        ) : (
          <p className="text-sm text-text-secondary">Story media unavailable.</p>
        )}
      </div>
    )
  }

  const profile = context?.type === "PROFILE" ? context : null
  const photoUrl = profile?.profilePhotoUrl ?? fallback.profilePreviewUrl
  const bio = profile?.bio ?? fallback.reportedBio

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium tracking-[0.12px] text-text-muted uppercase">Profile</p>
      <div className="flex gap-4">
        {photoUrl ? (
          <img src={photoUrl} alt="" className="size-28 rounded-md object-cover" />
        ) : (
          <div className="flex size-28 items-center justify-center rounded-md bg-surface-input text-xs text-text-muted">
            No photo
          </div>
        )}
        <p className="text-sm text-text-secondary">{bio?.trim() || "No bio"}</p>
      </div>
    </div>
  )
}

function DismissReportButton({
  reportId,
  onDismissed,
  className,
  showOnRowHover = false,
}: {
  reportId: string
  onDismissed?: () => void
  className?: string
  showOnRowHover?: boolean
}) {
  const pushToast = useAdminStore((s) => s.pushToast)
  const dismissMutation = useDismissReport()
  const isPending = dismissMutation.isPending && dismissMutation.variables === reportId

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    if (!window.confirm(DISMISS_REPORT_CONFIRM)) return

    try {
      await dismissMutation.mutateAsync(reportId)
      pushToast("Report dismissed.")
      onDismissed?.()
    } catch {
      pushToast("Could not dismiss report.")
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger
        delay={200}
        render={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={cn(
              showOnRowHover &&
                "opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100",
              className
            )}
            onClick={handleClick}
            disabled={isPending}
            aria-label={DISMISS_REPORT_HINT}
          />
        }
      >
        {isPending ? "Dismissing…" : "Dismiss"}
      </TooltipTrigger>
      <TooltipContent side="left" className="max-w-[220px] text-center">
        {DISMISS_REPORT_HINT}
      </TooltipContent>
    </Tooltip>
  )
}

function ReportDetailView({
  reportId,
  onBack,
}: {
  reportId: string
  onBack: () => void
}) {
  const detailQuery = useReportDetail(reportId)

  const report = detailQuery.data?.report
  const context = detailQuery.data?.context ?? null
  const normalized = report ? normalizeAdminFiledReport(report) : null

  return (
    <div className="space-y-6">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="-ml-2 w-fit gap-2 px-2 text-text-secondary hover:text-black"
      >
        <ArrowLeft className="size-4" />
        Back to reports
      </Button>

      {detailQuery.isLoading ? (
        <div className="admin-card space-y-4 p-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-64 w-full max-w-md" />
        </div>
      ) : detailQuery.isError || !normalized ? (
        <div className="admin-card p-6 text-sm text-[#FD1C1C]">
          Could not load this report.
        </div>
      ) : (
        <>
          <PageHeader
            title={`${reportTypeLabel(normalized.contentType)} report`}
            description={`Filed ${formatDateTime(normalized.createdAt)}`}
          />

          <div className="admin-card space-y-6 p-4 md:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1 text-sm">
                <p className="text-xs font-medium tracking-[0.12px] text-text-muted uppercase">
                  Reporter
                </p>
                {normalized.filedByAdmin || !normalized.reporterId ? (
                  <p>{normalized.reporterName}</p>
                ) : (
                  <UserDetailLink userId={normalized.reporterId} className="hover:underline">
                    {normalized.reporterName}
                  </UserDetailLink>
                )}
              </div>
              <div className="space-y-1 text-sm">
                <p className="text-xs font-medium tracking-[0.12px] text-text-muted uppercase">
                  Reported user
                </p>
                <UserDetailLink userId={normalized.reportedId} className="hover:underline">
                  {normalized.reportedName}
                </UserDetailLink>
              </div>
              <div className="space-y-1 text-sm sm:col-span-2">
                <p className="text-xs font-medium tracking-[0.12px] text-text-muted uppercase">
                  Reason
                </p>
                <p>{normalized.reason}</p>
              </div>
            </div>

            <ReportContentSection
              contentType={normalized.contentType}
              context={context}
              reportedUserId={normalized.reportedId}
              fallback={{
                storyPreviewUrl: normalized.storyPreviewUrl,
                profilePreviewUrl: normalized.profilePreviewUrl,
                reportedBio: normalized.reportedBio,
              }}
            />

            <div className="flex flex-wrap gap-2 border-t border-border-subtle pt-4">
              <UserDetailLink
                userId={normalized.reportedId}
                className="inline-flex h-9 items-center justify-center rounded-md border border-border-input bg-white px-4 text-sm font-medium hover:bg-surface-hover"
              >
                View reported user
              </UserDetailLink>
              <DismissReportButton reportId={reportId} onDismissed={onBack} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export function ReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeReportId = searchParams.get("reportId")
  const [typeFilter, setTypeFilter] = useState<string>("ALL")
  const [page, setPage] = useState(1)

  const reportsQuery = useReportsList({ contentType: typeFilter, page })
  const items = reportsQuery.data?.items ?? []
  const pagination = reportsQuery.data?.pagination

  const openReport = (reportId: string) => {
    setSearchParams({ reportId })
  }

  const closeReport = () => {
    setSearchParams({})
  }

  if (activeReportId) {
    return <ReportDetailView reportId={activeReportId} onBack={closeReport} />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Who reported whom, why, and what was reported."
      />

      <div className="admin-card p-4 md:p-5">
        <div className="w-full sm:w-72">
          <FilterField
            label="Content type"
            value={typeFilter}
            displayValue={REPORT_TYPE_LABELS[typeFilter as ReportContentType | "ALL"] ?? "All types"}
            onValueChange={(value) => {
              setTypeFilter(value)
              setPage(1)
            }}
          >
            <SelectItem value="ALL">All types</SelectItem>
            {(["PROFILE", "STORY", "CHAT"] as ReportContentType[]).map((type) => (
              <SelectItem key={type} value={type}>
                {REPORT_TYPE_LABELS[type]}
              </SelectItem>
            ))}
          </FilterField>
        </div>
      </div>

      <div className="admin-card overflow-hidden">
        {reportsQuery.isError ? (
          <div className="p-8 text-center text-sm text-[#FD1C1C]">
            Unable to load reports.
          </div>
        ) : (
          <div className="admin-table-scroll">
            <table className="min-w-[980px] w-full border-collapse">
              <thead>
                <tr className="bg-surface-input">
                  {["Created", "Type", "Reason", "Reporter", "Reported user", ""].map((col) => (
                    <th
                      key={col || "actions"}
                      className={cn(
                        "px-4 py-3 text-left text-xs font-medium text-text-muted",
                        !col && "w-[7.5rem] text-right"
                      )}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportsQuery.isLoading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <tr key={index} className="border-t border-border-subtle">
                      {Array.from({ length: 6 }).map((__, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-3">
                          <Skeleton className="h-4 w-full max-w-[140px]" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : items.length ? (
                  items.map((report) => {
                    const normalized = normalizeAdminFiledReport(report)
                    return (
                      <tr
                        key={report.id}
                        className="group cursor-pointer border-t border-border-subtle hover:bg-surface-hover"
                        onClick={() => openReport(report.id)}
                      >
                        <td className="px-4 py-3 text-sm">
                          {formatDateTime(normalized.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {reportTypeLabel(normalized.contentType)}
                        </td>
                        <td className="px-4 py-3 text-sm">{normalized.reason}</td>
                        <td className="px-4 py-3 text-sm">
                          {normalized.filedByAdmin || !normalized.reporterId ? (
                            <span onClick={(e) => e.stopPropagation()}>{normalized.reporterName}</span>
                          ) : (
                            <UserDetailLink
                              userId={normalized.reporterId}
                              className="hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {normalized.reporterName}
                            </UserDetailLink>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <UserDetailLink
                            userId={normalized.reportedId}
                            className="hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {normalized.reportedName}
                          </UserDetailLink>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <DismissReportButton
                            reportId={report.id}
                            showOnRowHover
                            onDismissed={() => {
                              if (items.length <= 1 && page > 1) {
                                setPage(page - 1)
                              }
                            }}
                          />
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-text-secondary">
                      No reports match this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {pagination ? (
          <div className="flex flex-col gap-3 border-t border-border-subtle px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-text-secondary">
              Page {pagination.page} of {pagination.totalPages} · {pagination.total.toLocaleString()}{" "}
              reports
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1 || reportsQuery.isFetching}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= pagination.totalPages || reportsQuery.isFetching}
              >
                Next
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
