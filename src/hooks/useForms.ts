import { useQuery } from "@tanstack/react-query"
import { adminApi } from "@/lib/api"

export function useFormsList(filters: { search: string; page: number }) {
  return useQuery({
    queryKey: ["admin", "forms", filters],
    queryFn: () =>
      adminApi.listForms({
        search: filters.search,
        page: filters.page,
        limit: 25,
      }),
    placeholderData: (previous) => previous,
  })
}

export function useFormDetail(formId: string | null) {
  return useQuery({
    queryKey: ["admin", "forms", "detail", formId],
    queryFn: () => adminApi.getFormDetail(formId!),
    enabled: Boolean(formId),
  })
}
