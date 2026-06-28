import { SectionCard } from "@/components/shared/FieldGrid"
import { Button } from "@/components/ui/button"
import type { StoryRecord } from "@/types"
import { formatDateTime } from "@/lib/formatters"

type UserContentTabProps = {
  activeStory: StoryRecord | null
  storyHistory: StoryRecord[]
}

export function UserContentTab({ activeStory, storyHistory }: UserContentTabProps) {
  return (
    <div className="space-y-6">
      <SectionCard title="Active story">
        {activeStory ? (
          <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
            <img
              src={activeStory.mediaUrl}
              alt=""
              className="aspect-[3/4] w-full max-w-xs rounded-[10px] object-cover"
            />
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                <div>
                  <p className="text-xs text-text-muted">Audience</p>
                  <p>{activeStory.audience}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Created</p>
                  <p>{formatDateTime(activeStory.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Expires</p>
                  <p>{formatDateTime(activeStory.expiresAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Interactions</p>
                  <p>
                    {activeStory.viewCount} views · {activeStory.likeCount} likes · {activeStory.commentCount} comments
                  </p>
                </div>
              </div>
              <Button variant="outline">Remove Story</Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-text-secondary">No active story.</p>
        )}
      </SectionCard>

      <SectionCard title="Story history">
        {storyHistory.length ? (
          <div className="admin-table-scroll">
            <table className="min-w-[760px] w-full border-collapse">
              <thead>
                <tr className="bg-surface-input">
                  {["Created", "Expires", "Media", "Audience", "Deleted", "Views", "Likes"].map((col) => (
                    <th key={col} className="px-3 py-2 text-left text-xs text-text-muted">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {storyHistory.map((story) => (
                  <tr key={story.id} className="border-t border-border-subtle hover:bg-surface-hover">
                    <td className="px-3 py-2 text-sm">{formatDateTime(story.createdAt)}</td>
                    <td className="px-3 py-2 text-sm">{formatDateTime(story.expiresAt)}</td>
                    <td className="px-3 py-2 text-sm">{story.mediaType}</td>
                    <td className="px-3 py-2 text-sm">{story.audience}</td>
                    <td className="px-3 py-2 text-sm">{story.deletedAt ? formatDateTime(story.deletedAt) : "—"}</td>
                    <td className="px-3 py-2 text-sm">{story.viewCount}</td>
                    <td className="px-3 py-2 text-sm">{story.likeCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-text-secondary">No story history.</p>
        )}
      </SectionCard>
    </div>
  )
}
