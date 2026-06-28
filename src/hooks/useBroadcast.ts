import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { adminApi } from "@/lib/api"

export function useBroadcastAudienceSize(audience: string) {
  return useQuery({
    queryKey: ["admin", "broadcast", "audience-size", audience],
    queryFn: () => adminApi.getBroadcastAudienceSize({ audience }),
    placeholderData: (previous) => previous,
  })
}

export function useBroadcastHistory(page: number) {
  return useQuery({
    queryKey: ["admin", "broadcast", "history", page],
    queryFn: () => adminApi.listBroadcastHistory(page),
    placeholderData: (previous) => previous,
  })
}

export function useSendBroadcast() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { title: string; body: string; audience: string }) =>
      adminApi.sendBroadcast(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "broadcast", "history"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "broadcast", "audience-size"] })
    },
  })
}
