import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { adminApi } from "@/lib/api"

export function useReportsList(filters: {
  contentType: string
  page: number
}) {
  return useQuery({
    queryKey: ["admin", "reports", filters],
    queryFn: () =>
      adminApi.listReports({
        contentType: filters.contentType,
        page: filters.page,
        limit: 25,
      }),
    placeholderData: (previous) => previous,
  })
}

export function useReportDetail(reportId: string | null) {
  return useQuery({
    queryKey: ["admin", "reports", reportId],
    queryFn: () => adminApi.getReportDetail(reportId!),
    enabled: Boolean(reportId),
  })
}

export function useDismissReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (reportId: string) => adminApi.dismissReport(reportId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] })
    },
  })
}
