import { useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { PageHeader } from "@/components/layout/PageHeader"
import { AccountStateBadge } from "@/components/shared/AccountStateBadge"
import { PremiumBadge } from "@/components/shared/PremiumBadge"
import { KpiCard } from "@/components/shared/KpiCard"
import { SectionCard } from "@/components/shared/FieldGrid"
import { TimeRangeSelector } from "@/components/shared/TimeRangeSelector"
import { UserDetailLink } from "@/components/users/UserDetailLink"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useRevenuePackBreakdown,
  useRevenueSummary,
  useRevenueTopBuyers,
} from "@/hooks/useRevenue"
import { canAccessRevenue, useAdminStore } from "@/stores/adminStore"
import type { AccountState, PremiumStatus, TimeWindow } from "@/types/enums"
import { formatCurrencyInr } from "@/lib/formatters"
import {
  PACK_CODE_COLOR,
  PREMIUM_PLAN_COLORS,
  REVENUE_SERIES_COLORS,
} from "@/lib/chartColors"

function KpiSkeleton() {
  return (
    <div className="admin-card p-5">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-4 h-8 w-20" />
    </div>
  )
}

function ChartSkeleton({ className }: { className?: string }) {
  return <Skeleton className={className ?? "h-72 w-full"} />
}

export function RevenuePage() {
  const admin = useAdminStore((s) => s.admin)
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("30d")
  const [buyersPage, setBuyersPage] = useState(1)

  const summaryQuery = useRevenueSummary(timeWindow)
  const buyersQuery = useRevenueTopBuyers(timeWindow, buyersPage)
  const packQuery = useRevenuePackBreakdown(timeWindow)

  const summary = summaryQuery.data?.summary
  const daily = summaryQuery.data?.daily ?? []
  const premiumPlanMix = summaryQuery.data?.premiumPlanMix ?? []
  const topBuyers = buyersQuery.data?.items ?? []
  const buyersPagination = buyersQuery.data?.pagination
  const packBreakdown = packQuery.data?.items ?? []

  const handleWindowChange = (window: TimeWindow) => {
    setTimeWindow(window)
    setBuyersPage(1)
  }

  if (!admin || !canAccessRevenue(admin.role)) {
    return (
      <div className="admin-card p-8 text-center text-sm text-text-secondary">
        Revenue analytics are restricted to admin accounts.
      </div>
    )
  }

  const summaryLoading = summaryQuery.isLoading
  const summaryError = summaryQuery.isError

  return (
    <div className="space-y-8">
      <PageHeader
        title="Revenue"
        description="Monetisation health across subscriptions, boosts, comments, and chat unlocks."
        actions={<TimeRangeSelector value={timeWindow} onChange={handleWindowChange} />}
      />

      {summaryError ? (
        <div className="admin-card p-8 text-center text-sm text-[#FD1C1C]">
          Unable to load revenue data from the admin API.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            {summaryLoading || !summary ? (
              Array.from({ length: 5 }).map((_, index) => <KpiSkeleton key={index} />)
            ) : (
              <>
                <KpiCard label="Total revenue" value={summary.totalRevenue} timeWindow={timeWindow} />
                <KpiCard
                  label="Premium subscriptions"
                  value={summary.subscriptionsSold}
                  timeWindow={timeWindow}
                />
                <KpiCard label="Boosts sold" value={summary.boostsSold} timeWindow={timeWindow} />
                <KpiCard
                  label="Comment packs sold"
                  value={summary.commentPacksSold}
                  timeWindow={timeWindow}
                />
                <KpiCard
                  label="Chat unlocks sold"
                  value={summary.chatUnlocksSold}
                  timeWindow={timeWindow}
                />
              </>
            )}
          </div>

          <SectionCard title="Revenue over time">
            <div className="h-72">
              {summaryLoading ? (
                <ChartSkeleton className="h-72 w-full" />
              ) : daily.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={daily}>
                    <CartesianGrid stroke="#EFEFEF" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                    <YAxis tick={{ fontSize: 11 }} width={32} allowDecimals={false} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="subscriptions"
                      stroke={REVENUE_SERIES_COLORS.subscriptions}
                      dot={false}
                      name="Premium"
                    />
                    <Line
                      type="monotone"
                      dataKey="boosts"
                      stroke={REVENUE_SERIES_COLORS.boosts}
                      dot={false}
                      name="Boosts"
                    />
                    <Line
                      type="monotone"
                      dataKey="comments"
                      stroke={REVENUE_SERIES_COLORS.comments}
                      dot={false}
                      name="Comments"
                    />
                    <Line
                      type="monotone"
                      dataKey="chatUnlocks"
                      stroke={REVENUE_SERIES_COLORS.chatUnlocks}
                      dot={false}
                      name="Chat unlocks"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="py-16 text-center text-sm text-text-secondary">
                  No purchase events in this period.
                </p>
              )}
            </div>
          </SectionCard>

          <div className="grid gap-6 xl:grid-cols-2">
            <SectionCard title="Top buyers">
              {buyersQuery.isError ? (
                <p className="text-sm text-[#FD1C1C]">Unable to load top buyers.</p>
              ) : (
                <>
                  <div className="admin-table-scroll">
                    <table className="min-w-[640px] w-full border-collapse">
                      <thead>
                        <tr className="bg-surface-input">
                          {["User", "Purchases", "Spend", "Premium", "State"].map((col) => (
                            <th key={col} className="px-3 py-2 text-left text-xs text-text-muted">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {buyersQuery.isLoading ? (
                          Array.from({ length: 5 }).map((_, index) => (
                            <tr key={index} className="border-t border-border-subtle">
                              {Array.from({ length: 5 }).map((__, cellIndex) => (
                                <td key={cellIndex} className="px-3 py-2">
                                  <Skeleton className="h-4 w-full max-w-[100px]" />
                                </td>
                              ))}
                            </tr>
                          ))
                        ) : topBuyers.length ? (
                          topBuyers.map((buyer) => (
                            <tr key={buyer.userId} className="border-t border-border-subtle">
                              <td className="px-3 py-2 text-sm">
                                <UserDetailLink userId={buyer.userId} className="hover:underline">
                                  {buyer.userName}
                                </UserDetailLink>
                              </td>
                              <td className="px-3 py-2 text-sm">{buyer.totalPurchases}</td>
                              <td className="px-3 py-2 text-sm">
                                {formatCurrencyInr(buyer.totalSpend)}
                              </td>
                              <td className="px-3 py-2 text-sm">
                                <PremiumBadge status={buyer.premiumStatus as PremiumStatus} />
                              </td>
                              <td className="px-3 py-2 text-sm">
                                <AccountStateBadge state={buyer.accountState as AccountState} />
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-3 py-10 text-center text-sm text-text-secondary"
                            >
                              No purchases in this period.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {buyersPagination && buyersPagination.totalPages > 1 ? (
                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-border-subtle pt-3">
                      <p className="text-sm text-text-secondary">
                        Page {buyersPagination.page} of {buyersPagination.totalPages}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={buyersPage <= 1 || buyersQuery.isFetching}
                          onClick={() => setBuyersPage(buyersPage - 1)}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={
                            buyersPage >= buyersPagination.totalPages || buyersQuery.isFetching
                          }
                          onClick={() => setBuyersPage(buyersPage + 1)}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </SectionCard>

            <SectionCard title="Premium plan mix">
              <div className="h-56">
                {summaryLoading ? (
                  <ChartSkeleton className="h-56 w-full" />
                ) : premiumPlanMix.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={premiumPlanMix}
                        dataKey="count"
                        nameKey="planCode"
                        innerRadius={50}
                        outerRadius={80}
                      >
                        {premiumPlanMix.map((_, index) => (
                          <Cell
                            key={index}
                            fill={PREMIUM_PLAN_COLORS[index % PREMIUM_PLAN_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, _name, item) => [
                          `${value} (${item.payload.percentage}%)`,
                          item.payload.planCode,
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="flex h-full items-center justify-center text-sm text-text-secondary">
                    No active premium users with a plan code.
                  </p>
                )}
              </div>
            </SectionCard>
          </div>

          <SectionCard title="Pack code breakdown">
            <div className="h-64">
              {packQuery.isLoading ? (
                <ChartSkeleton className="h-64 w-full" />
              ) : packQuery.isError ? (
                <p className="py-16 text-center text-sm text-[#FD1C1C]">
                  Unable to load pack breakdown.
                </p>
              ) : packBreakdown.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={packBreakdown}>
                    <CartesianGrid stroke="#EFEFEF" vertical={false} />
                    <XAxis dataKey="packCode" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} width={32} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill={PACK_CODE_COLOR} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="py-16 text-center text-sm text-text-secondary">
                  No pack purchases in this period.
                </p>
              )}
            </div>
          </SectionCard>
        </>
      )}
    </div>
  )
}
