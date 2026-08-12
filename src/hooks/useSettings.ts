import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { adminApi } from "@/lib/api"

export function useAdminAccount() {
  return useQuery({
    queryKey: ["admin", "settings", "account"],
    queryFn: () => adminApi.getAccount(),
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string
      newPassword: string
    }) => adminApi.changePassword(currentPassword, newPassword),
  })
}

export function useSeoAdminSettings() {
  return useQuery({
    queryKey: ["admin", "settings", "seo-admin"],
    queryFn: () => adminApi.getSeoAdmin(),
  })
}

export function useSeoAdminSessions() {
  return useQuery({
    queryKey: ["admin", "settings", "seo-admin", "sessions"],
    queryFn: () => adminApi.listSeoAdminSessions(),
  })
}

export function useSaveSeoAdmin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: { email: string; password?: string; name?: string }) =>
      adminApi.saveSeoAdmin(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings", "seo-admin"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "settings", "seo-admin", "sessions"] })
    },
  })
}

export function useRevokeSeoAdminSessions() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => adminApi.revokeSeoAdminSessions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings", "seo-admin"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "settings", "seo-admin", "sessions"] })
    },
  })
}
