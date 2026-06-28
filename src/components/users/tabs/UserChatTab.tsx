import { useEffect, useState } from "react"
import { SectionCard } from "@/components/shared/FieldGrid"
import { UserDetailLink } from "@/components/users/UserDetailLink"
import { Skeleton } from "@/components/ui/skeleton"
import { useUserChatMessages } from "@/hooks/useUsers"
import { useAdminStore } from "@/stores/adminStore"
import type { ChatThreadSummary } from "@/types"
import { formatDateTime } from "@/lib/formatters"
import { cn } from "@/lib/utils"

type UserChatTabProps = {
  userId: string
  threads: ChatThreadSummary[]
}

export function UserChatTab({ userId, threads }: UserChatTabProps) {
  const pushToast = useAdminStore((s) => s.pushToast)
  const [activeThreadId, setActiveThreadId] = useState<string | null>(threads[0]?.id ?? null)

  useEffect(() => {
    setActiveThreadId(threads[0]?.id ?? null)
  }, [threads, userId])

  const messagesQuery = useUserChatMessages(userId, activeThreadId, Boolean(activeThreadId))
  const messages = messagesQuery.data?.messages ?? []

  return (
    <div className="space-y-4">
      <div className="rounded-[10px] border border-[#FD1C1C] bg-white px-4 py-3 text-sm text-black">
        Chat content is private. Access is logged. Only open threads when there is an active report or moderation reason.
      </div>

      {threads.length ? (
        <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
          <SectionCard title="Thread list" className="h-fit">
            <div className="space-y-2">
              {threads.map((thread) => (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => {
                    setActiveThreadId(thread.id)
                    pushToast("Chat access logged to admin audit trail (mock).")
                  }}
                  className={cn(
                    "w-full rounded-[10px] border px-3 py-3 text-left transition-colors",
                    activeThreadId === thread.id
                      ? "border-black bg-surface-input"
                      : "border-border-card hover:bg-surface-hover"
                  )}
                >
                  <p className="text-sm font-medium">
                    <UserDetailLink
                      userId={thread.otherParticipantId}
                      className="hover:underline"
                    >
                      {thread.otherParticipantName}
                    </UserDetailLink>
                  </p>
                  <p className="mt-1 text-xs text-text-muted">
                    {thread.threadType} · {thread.relationshipState} · {thread.isUnlocked ? "Unlocked" : "Locked"}
                  </p>
                  <p className="mt-1 text-xs text-text-meta">{formatDateTime(thread.lastMessageAt)}</p>
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Read-only chat view">
            {messagesQuery.isLoading ? (
              <div className="space-y-3 p-4">
                <Skeleton className="h-12 w-2/3" />
                <Skeleton className="ml-auto h-12 w-1/2" />
                <Skeleton className="h-12 w-3/5" />
              </div>
            ) : (
              <div className="max-h-[480px] space-y-3 overflow-y-auto rounded-[10px] border border-border-subtle p-4">
                {messages.length ? (
                  messages.map((message) => {
                    const isSelf = message.senderUserId === userId
                    const deleted = Boolean(message.deletedAt)
                    return (
                      <div key={message.id} className={cn("flex", isSelf ? "justify-end" : "justify-start")}>
                        <div
                          className={cn(
                            "max-w-[80%] rounded-[14px] px-3 py-2 text-sm",
                            message.isReported && "ring-2 ring-[#FD1C1C]",
                            isSelf ? "bg-black text-white" : "border border-border-card bg-white text-black",
                            deleted && "opacity-60"
                          )}
                        >
                          {deleted ? (
                            <span className="italic">[message deleted]</span>
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
                          <p className={cn("mt-1 text-[11px]", isSelf ? "text-white/70" : "text-text-meta")}>
                            {formatDateTime(message.createdAt)} · {message.messageType}
                          </p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-sm text-text-secondary">No messages in this thread.</p>
                )}
              </div>
            )}
          </SectionCard>
        </div>
      ) : (
        <p className="text-sm text-text-secondary">No chat threads.</p>
      )}
    </div>
  )
}
