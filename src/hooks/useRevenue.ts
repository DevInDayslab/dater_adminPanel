import { useQuery } from "@tanstack/react-query"
import { adminApi } from "@/lib/api"
import type { TimeWindow } from "@/types/enums"

export function useRevenueSummary(window: TimeWindow) {
  return useQuery({
    queryKey: ["admin", "revenue", "summary", window],
    queryFn: () => adminApi.getRevenueSummary(window),
    placeholderData: (previous) => previous,
  })
}

export function useRevenueTopBuyers(window: TimeWindow, page: number) {
  return useQuery({
    queryKey: ["admin", "revenue", "top-buyers", window, page],
    queryFn: () => adminApi.getRevenueTopBuyers(window, page),
    placeholderData: (previous) => previous,
  })
}

export function useRevenuePackBreakdown(window: TimeWindow) {
  return useQuery({
    queryKey: ["admin", "revenue", "pack-breakdown", window],
    queryFn: () => adminApi.getRevenuePackBreakdown(window),
    placeholderData: (previous) => previous,
  })
}
