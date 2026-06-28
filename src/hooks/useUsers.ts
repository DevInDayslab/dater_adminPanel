import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { adminApi } from "@/lib/api"
import type { UsersListQuery } from "@/lib/api"
import type { UsersListFilters } from "@/hooks/useUsersListParams"
import { USERS_PAGE_SIZE } from "@/lib/constants"

export function usersListQueryFromFilters(filters: UsersListFilters): UsersListQuery {
  return {
    search: filters.search.trim() || undefined,
    state: filters.state !== "ALL" ? filters.state : undefined,
    premium:
      filters.premium === "PREMIUM"
        ? "premium"
        : filters.premium === "FREE"
          ? "free"
          : undefined,
    verified:
      filters.verified === "VERIFIED"
        ? "verified"
        : filters.verified === "UNVERIFIED"
          ? "unverified"
          : undefined,
    gender: filters.gender !== "ALL" ? filters.gender : undefined,
    page: filters.page,
    limit: USERS_PAGE_SIZE,
  }
}

export function useUsersList(filters: UsersListFilters) {
  const query = usersListQueryFromFilters(filters)

  return useQuery({
    queryKey: ["admin", "users", query],
    queryFn: () => adminApi.listUsers(query),
    placeholderData: (previous) => previous,
  })
}

export function useUserProfile(userId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: ["admin", "users", userId, "profile"],
    queryFn: () => adminApi.getUserProfile(userId!),
    enabled: Boolean(userId) && enabled,
  })
}

export function useUserTrust(userId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: ["admin", "users", userId, "trust"],
    queryFn: () => adminApi.getUserTrust(userId!),
    enabled: Boolean(userId) && enabled,
  })
}

export function useUserRevenue(userId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: ["admin", "users", userId, "revenue"],
    queryFn: () => adminApi.getUserRevenue(userId!),
    enabled: Boolean(userId) && enabled,
  })
}

export function useUserPhotos(userId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: ["admin", "users", userId, "photos"],
    queryFn: () => adminApi.getUserPhotos(userId!),
    enabled: Boolean(userId) && enabled,
  })
}

export function useUserVerification(userId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: ["admin", "users", userId, "verification"],
    queryFn: () => adminApi.getUserVerification(userId!),
    enabled: Boolean(userId) && enabled,
  })
}

export function useUserFilters(userId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: ["admin", "users", userId, "filters"],
    queryFn: () => adminApi.getUserFilters(userId!),
    enabled: Boolean(userId) && enabled,
  })
}

export function useUserContent(userId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: ["admin", "users", userId, "content"],
    queryFn: () => adminApi.getUserContent(userId!),
    enabled: Boolean(userId) && enabled,
  })
}

export function useUserChat(userId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: ["admin", "users", userId, "chat"],
    queryFn: () => adminApi.getUserChat(userId!),
    enabled: Boolean(userId) && enabled,
  })
}

export function useUserChatMessages(
  userId: string | null,
  threadId: string | null,
  enabled: boolean
) {
  return useQuery({
    queryKey: ["admin", "users", userId, "chat", threadId, "messages"],
    queryFn: () => adminApi.getUserChatMessages(userId!, threadId!),
    enabled: Boolean(userId) && Boolean(threadId) && enabled,
  })
}

export function useUserSocial(userId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: ["admin", "users", userId, "social"],
    queryFn: () => adminApi.getUserSocial(userId!),
    enabled: Boolean(userId) && enabled,
  })
}

export function useFileUserReport(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (reason: string) => adminApi.fileUserReport(userId, reason),
    onSuccess: () => {
      invalidateUserQueries(queryClient, userId)
    },
  })
}

function invalidateUserQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  userId: string
) {
  queryClient.invalidateQueries({ queryKey: ["admin", "users", userId] })
  queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
}

export function useUserEntitlementMutations(userId: string) {
  const queryClient = useQueryClient()
  const onSuccess = () => invalidateUserQueries(queryClient, userId)

  return {
    grantPremium: useMutation({
      mutationFn: (durationDays: number) => adminApi.grantPremium(userId, durationDays),
      onSuccess,
    }),
    removePremium: useMutation({
      mutationFn: () => adminApi.removePremium(userId),
      onSuccess,
    }),
    grantBoosts: useMutation({
      mutationFn: (amount: number) => adminApi.grantBoostCredits(userId, amount),
      onSuccess,
    }),
    grantComments: useMutation({
      mutationFn: (amount: number) => adminApi.grantCommentCredits(userId, amount),
      onSuccess,
    }),
  }
}

export function useUserModerationMutations(userId: string) {
  const queryClient = useQueryClient()

  const onSuccess = () => invalidateUserQueries(queryClient, userId)

  return {
    issueWarning: useMutation({
      mutationFn: (reason?: string) => adminApi.issueUserWarning(userId, reason),
      onSuccess,
    }),
    hideUser: useMutation({
      mutationFn: (reason?: string) => adminApi.hideUser(userId, reason),
      onSuccess,
    }),
    unhideUser: useMutation({
      mutationFn: () => adminApi.unhideUser(userId),
      onSuccess,
    }),
    banUser: useMutation({
      mutationFn: (reason?: string) => adminApi.banUser(userId, reason),
      onSuccess,
    }),
    unbanUser: useMutation({
      mutationFn: () => adminApi.unbanUser(userId),
      onSuccess,
    }),
    deleteUser: useMutation({
      mutationFn: () => adminApi.deleteUser(userId),
      onSuccess,
    }),
  }
}
