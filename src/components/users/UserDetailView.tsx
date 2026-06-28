import { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { UserIdentityCard } from "@/components/users/UserIdentityCard"
import { UserProfileTab } from "@/components/users/tabs/UserProfileTab"
import { UserTrustTab } from "@/components/users/tabs/UserTrustTab"
import { UserRevenueTab } from "@/components/users/tabs/UserRevenueTab"
import { UserPhotosTab } from "@/components/users/tabs/UserPhotosTab"
import { UserFiltersTab } from "@/components/users/tabs/UserFiltersTab"
import { UserContentTab } from "@/components/users/tabs/UserContentTab"
import { UserChatTab } from "@/components/users/tabs/UserChatTab"
import { UserSocialTab } from "@/components/users/tabs/UserSocialTab"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { userDetailTabs } from "@/components/layout/nav-items"
import {
  useUserChat,
  useUserContent,
  useUserFilters,
  useUserPhotos,
  useUserProfile,
  useUserSocial,
  useUserTrust,
  useUserVerification,
} from "@/hooks/useUsers"
import { cn } from "@/lib/utils"

type UserDetailViewProps = {
  userId: string
  onBack: () => void
}

type UserDetailTabSlug = (typeof userDetailTabs)[number]["slug"]

function TabSkeleton() {
  return (
    <div className="space-y-4 p-1">
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  )
}

function TabError({ message }: { message: string }) {
  return <p className="px-1 py-6 text-sm text-[#FD1C1C]">{message}</p>
}

export function UserDetailView({ userId, onBack }: UserDetailViewProps) {
  const [activeTab, setActiveTab] = useState<UserDetailTabSlug>("profile")

  useEffect(() => {
    setActiveTab("profile")
  }, [userId])

  const profileQuery = useUserProfile(userId, true)
  const trustQuery = useUserTrust(userId, true)
  const photosQuery = useUserPhotos(userId, activeTab === "photos")
  const verificationQuery = useUserVerification(userId, activeTab === "photos")
  const filtersQuery = useUserFilters(userId, activeTab === "filters")
  const contentQuery = useUserContent(userId, activeTab === "content")
  const chatQuery = useUserChat(userId, activeTab === "chat")
  const socialQuery = useUserSocial(userId, activeTab === "social")

  const profile = profileQuery.data

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="-ml-2 w-fit gap-2 px-2 text-text-secondary hover:text-black"
        >
          <ArrowLeft className="size-4" />
          Back to users
        </Button>

        <div>
          <h1 className="font-heading text-2xl">
            {profile?.name ? profile.name : "User details"}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {profile
              ? `${profile.genderMain ?? "Unknown gender"}${profile.livingInCity ? ` · ${profile.livingInCity}` : ""} · ${profile.id}`
              : "Loading profile…"}
          </p>
        </div>
      </div>

      {profileQuery.isLoading ? (
        <div className="admin-card p-6">
          <Skeleton className="h-20 w-full" />
        </div>
      ) : profileQuery.isError || !profile ? (
        <div className="admin-card p-8 text-sm text-text-secondary">
          {profileQuery.isError ? "Unable to load user profile." : "User not found."}
        </div>
      ) : (
        <div className="admin-card p-4 md:p-6">
          <UserIdentityCard
            userId={userId}
            profile={profile}
            totalReports={trustQuery.data?.reportsAgainst.length ?? profile.moderationWarningCount}
          />
        </div>
      )}

      <div className="admin-card overflow-hidden">
        <div className="admin-table-scroll border-b border-border-subtle px-4 md:px-6">
          <div className="flex min-w-max gap-1">
            {userDetailTabs.map((tab) => (
              <button
                key={tab.slug}
                type="button"
                onClick={() => setActiveTab(tab.slug)}
                className={cn(
                  "rounded-t-md px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors",
                  activeTab === tab.slug
                    ? "border-b-2 border-black text-black"
                    : "text-text-secondary hover:text-black"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-6 md:px-6">
          {activeTab === "profile" ? (
            profileQuery.isLoading ? (
              <TabSkeleton />
            ) : profileQuery.isError || !profile ? (
              <TabError message="Unable to load profile." />
            ) : (
              <UserProfileTab profile={profile} />
            )
          ) : null}

          {activeTab === "trust" ? (
            trustQuery.isLoading || profileQuery.isLoading ? (
              <TabSkeleton />
            ) : trustQuery.isError || !trustQuery.data || !profile ? (
              <TabError message="Unable to load trust & safety data." />
            ) : (
              <UserTrustTab userId={userId} trust={trustQuery.data} profile={profile} />
            )
          ) : null}

          {activeTab === "revenue" ? <UserRevenueTab userId={userId} enabled /> : null}

          {activeTab === "photos" ? (
            photosQuery.isLoading || verificationQuery.isLoading ? (
              <TabSkeleton />
            ) : photosQuery.isError || verificationQuery.isError ? (
              <TabError message="Unable to load photos & verification data." />
            ) : (
              <UserPhotosTab
                photos={photosQuery.data?.photos ?? []}
                profile={{
                  verificationSelfieUrl:
                    verificationQuery.data?.verificationSelfieUrl ??
                    profile?.verificationSelfieUrl ??
                    null,
                  isVerified: profile?.isVerified ?? false,
                }}
                verificationSessions={verificationQuery.data?.sessions ?? []}
              />
            )
          ) : null}

          {activeTab === "filters" ? (
            filtersQuery.isLoading ? (
              <TabSkeleton />
            ) : filtersQuery.isError || !filtersQuery.data ? (
              <TabError message="Unable to load discovery filters." />
            ) : (
              <UserFiltersTab
                filters={filtersQuery.data}
                livingInCity={profile?.livingInCity ?? null}
              />
            )
          ) : null}

          {activeTab === "content" ? (
            contentQuery.isLoading ? (
              <TabSkeleton />
            ) : contentQuery.isError || !contentQuery.data ? (
              <TabError message="Unable to load content." />
            ) : (
              <UserContentTab
                activeStory={contentQuery.data.activeStory}
                storyHistory={contentQuery.data.storyHistory}
              />
            )
          ) : null}

          {activeTab === "chat" ? (
            chatQuery.isLoading ? (
              <TabSkeleton />
            ) : chatQuery.isError || !chatQuery.data ? (
              <TabError message="Unable to load chat threads." />
            ) : (
              <UserChatTab userId={userId} threads={chatQuery.data.threads} />
            )
          ) : null}

          {activeTab === "social" ? (
            socialQuery.isLoading ? (
              <TabSkeleton />
            ) : socialQuery.isError || !socialQuery.data ? (
              <TabError message="Unable to load social graph." />
            ) : (
              <UserSocialTab
                friends={socialQuery.data.friends}
                pendingSent={socialQuery.data.pendingSent}
                pendingReceived={socialQuery.data.pendingReceived}
                notifications={socialQuery.data.notifications}
                sessions={socialQuery.data.sessions}
                pushTokens={socialQuery.data.pushTokens}
              />
            )
          ) : null}
        </div>
      </div>
    </div>
  )
}
