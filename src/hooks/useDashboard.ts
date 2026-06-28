import { useQuery } from "@tanstack/react-query"
import { adminApi } from "@/lib/api"
import type { DashboardGrowthWindow, TimeWindow } from "@/types/enums"

export function useDashboardStats() {
  return useQuery({
    queryKey: ["admin", "dashboard", "stats"],
    queryFn: () => adminApi.getDashboardStats(),
  })
}

export function useDashboardGrowth(window: DashboardGrowthWindow) {
  return useQuery({
    queryKey: ["admin", "dashboard", "growth", window],
    queryFn: () => adminApi.getDashboardGrowth(window),
  })
}

export function useDashboardBadges() {
  return useQuery({
    queryKey: ["admin", "dashboard", "badges"],
    queryFn: () => adminApi.getDashboardBadges(),
    refetchInterval: 60_000,
  })
}

export function useDashboardBreakdowns() {
  return useQuery({
    queryKey: ["admin", "dashboard", "breakdowns"],
    queryFn: () => adminApi.getDashboardBreakdowns(),
  })
}

export function useDashboardRevenue(window: TimeWindow) {
  return useQuery({
    queryKey: ["admin", "dashboard", "revenue", window],
    queryFn: () => adminApi.getDashboardRevenue(window),
  })
}
