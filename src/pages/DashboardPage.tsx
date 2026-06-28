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
import { KpiCard, MiniStatCard } from "@/components/shared/KpiCard"
import { SectionCard } from "@/components/shared/FieldGrid"
import { TimeRangeSelector } from "@/components/shared/TimeRangeSelector"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useDashboardBreakdowns,
  useDashboardGrowth,
  useDashboardRevenue,
  useDashboardStats,
} from "@/hooks/useDashboard"
import type { DashboardGrowthWindow, TimeWindow } from "@/types/enums"
import { formatAccountStateLabel } from "@/lib/formatters"
import {
  ACCOUNT_STATE_COLORS,
  CHART_SERIES,
  GENDER_CHART_COLORS,
  GROWTH_LINE_COLOR,
} from "@/lib/chartColors"
import { cn } from "@/lib/utils"

function KpiSkeleton() {
  return (
    <div className="admin-card p-4 md:p-5">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-3 h-8 w-24" />
    </div>
  )
}

function ChartSkeleton({ className }: { className?: string }) {
  return <Skeleton className={cn("h-full w-full", className)} />
}

export function DashboardPage() {
  const [growthWindow, setGrowthWindow] = useState<DashboardGrowthWindow>("30d")
  const [revenueWindow, setRevenueWindow] = useState<TimeWindow>("7d")

  const statsQuery = useDashboardStats()
  const growthQuery = useDashboardGrowth(growthWindow)
  const breakdownsQuery = useDashboardBreakdowns()
  const revenueQuery = useDashboardRevenue(revenueWindow)

  const stats = statsQuery.data
  const growthPoints = growthQuery.data?.data ?? []
  const breakdowns = breakdownsQuery.data
  const revenue = revenueQuery.data

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Live platform snapshot. Purchase charts use their own time filters below."
      />

      <section>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          {statsQuery.isLoading ? (
            Array.from({ length: 5 }).map((_, index) => <KpiSkeleton key={index} />)
          ) : stats ? (
            <>
              <KpiCard label="Total Users" value={stats.totalUsers} />
              <KpiCard label="Active Today (DAU)" value={stats.dau} />
              <KpiCard label="Active This Month (MAU)" value={stats.mau} />
              <KpiCard label="Premium Users" value={stats.activePremiumUsers} />
              <KpiCard label="Total Reports" value={stats.totalReports} />
            </>
          ) : (
            <div className="admin-card col-span-full p-6 text-sm text-text-secondary">
              Unable to load dashboard stats.
            </div>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SectionCard
          title="User growth"
          description="New registrations per day for the selected range."
          className="min-h-[320px]"
        >
          <div className="mb-4 flex gap-1">
            {(["7d", "30d", "90d"] as DashboardGrowthWindow[]).map((window) => (
              <button
                key={window}
                type="button"
                onClick={() => setGrowthWindow(window)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium",
                  growthWindow === window
                    ? "bg-black text-white"
                    : "text-text-secondary hover:bg-surface-input"
                )}
              >
                {window}
              </button>
            ))}
          </div>
          <div className="h-56">
            {growthQuery.isLoading ? (
              <ChartSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthPoints}>
                  <CartesianGrid stroke="#EFEFEF" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis tick={{ fontSize: 11 }} width={32} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: "0.7px solid #D1D1D1" }} />
                  <Line
                    type="monotone"
                    dataKey="newUsers"
                    stroke={GROWTH_LINE_COLOR}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Gender breakdown" description="Distribution of gender_main.">
          <div className="h-56">
            {breakdownsQuery.isLoading ? (
              <ChartSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={breakdowns?.genderBreakdown ?? []}
                    dataKey="count"
                    nameKey="genderMain"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={2}
                  >
                    {(breakdowns?.genderBreakdown ?? []).map((item, index) => (
                      <Cell
                        key={item.genderMain}
                        fill={
                          GENDER_CHART_COLORS[item.genderMain] ??
                          CHART_SERIES[index % CHART_SERIES.length]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, _name, item) => [
                      `${value} (${item.payload.percentage}%)`,
                      item.payload.genderMain,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          {!breakdownsQuery.isLoading && breakdowns ? (
            <div className="mt-3 flex flex-wrap gap-3">
              {breakdowns.genderBreakdown.map((item, index) => (
                <div key={item.genderMain} className="flex items-center gap-2 text-xs text-text-secondary">
                  <span
                    className="size-2 rounded-full"
                    style={{
                      background:
                        GENDER_CHART_COLORS[item.genderMain] ??
                        CHART_SERIES[index % CHART_SERIES.length],
                    }}
                  />
                  {item.genderMain} · {item.count.toLocaleString()} ({item.percentage}%)
                </div>
              ))}
            </div>
          ) : null}
        </SectionCard>
      </div>

      <SectionCard title="Account state distribution" description="Users by account_state.">
        <div className="h-72">
          {breakdownsQuery.isLoading ? (
            <ChartSkeleton className="h-72" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={breakdowns?.accountStateBreakdown ?? []} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid stroke="#EFEFEF" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="accountState"
                  width={140}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => formatAccountStateLabel(v)}
                />
                <Tooltip labelFormatter={(v) => formatAccountStateLabel(String(v))} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {(breakdowns?.accountStateBreakdown ?? []).map((entry, index) => (
                    <Cell
                      key={entry.accountState}
                      fill={ACCOUNT_STATE_COLORS[index % ACCOUNT_STATE_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </SectionCard>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2>Revenue summary</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Purchase counts for the selected period.
            </p>
          </div>
          <TimeRangeSelector value={revenueWindow} onChange={setRevenueWindow} />
        </div>
        {revenueQuery.isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        ) : revenue ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <MiniStatCard label="Boosts purchased" value={revenue.summary.boostsSold} />
            <MiniStatCard label="Comments purchased" value={revenue.summary.commentPacksSold} />
            <MiniStatCard label="Premium subscriptions" value={revenue.summary.subscriptionsSold} />
          </div>
        ) : null}
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SectionCard
          title="Onboarding funnel"
          description="Users currently at each onboarding_step."
        >
          <div className="h-64">
            {breakdownsQuery.isLoading ? (
              <ChartSkeleton className="h-64" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breakdowns?.onboardingFunnel ?? []} layout="vertical">
                  <CartesianGrid stroke="#EFEFEF" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="onboardingStep" width={120} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Verification stats">
          {breakdownsQuery.isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          ) : breakdowns ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <MiniStatCard label="Verified users" value={breakdowns.verificationStats.verifiedCount} />
              <MiniStatCard
                label="Unverified users"
                value={breakdowns.verificationStats.unverifiedCount}
              />
              <MiniStatCard
                label="Success rate"
                value={`${breakdowns.verificationStats.successRate}%`}
              />
              <MiniStatCard
                label="Total attempts"
                value={breakdowns.verificationStats.totalAttempts}
              />
            </div>
          ) : null}
        </SectionCard>
      </div>
    </div>
  )
}
