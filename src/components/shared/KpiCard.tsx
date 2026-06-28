import { cn } from "@/lib/utils"
import { formatCurrencyInr, formatDeltaLabel, formatPercent } from "@/lib/formatters"
import type { TimeWindow } from "@/types/enums"

export function KpiCard({
  label,
  value,
  delta,
  timeWindow,
  className,
}: {
  label: string
  value: string | number
  delta?: number
  timeWindow?: TimeWindow
  className?: string
}) {
  const windowLabel =
    timeWindow === "7d"
      ? "last 7d"
      : timeWindow === "30d"
        ? "last 30d"
        : timeWindow === "6m"
          ? "last 6m"
          : timeWindow === "1y"
            ? "last year"
            : "all time"

  return (
    <div className={cn("admin-card p-4 md:p-5", className)}>
      <p className="text-xs font-medium tracking-[0.12px] text-text-muted uppercase">{label}</p>
      <p className="mt-3 text-[26px] font-medium leading-none text-black">
        {typeof value === "number" && label.toLowerCase().includes("revenue")
          ? formatCurrencyInr(value)
          : value.toLocaleString?.() ?? value}
      </p>
      {delta !== undefined && timeWindow && timeWindow !== "all" ? (
        <p
          className={cn(
            "mt-2 text-xs",
            delta >= 0 ? "text-text-secondary" : "text-[#FD1C1C]"
          )}
        >
          {formatDeltaLabel(delta, windowLabel)}
        </p>
      ) : null}
    </div>
  )
}

export function MiniStatCard({
  label,
  value,
  className,
}: {
  label: string
  value: string | number
  className?: string
}) {
  return (
    <div className={cn("admin-card p-4", className)}>
      <p className="text-xs font-medium tracking-[0.12px] text-text-muted uppercase">{label}</p>
      <p className="mt-2 text-lg font-medium text-black">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </div>
  )
}

export function DeltaBadge({ delta }: { delta: number }) {
  return (
    <span className={cn("text-xs", delta >= 0 ? "text-text-secondary" : "text-[#FD1C1C]")}>
      {formatPercent(delta)}
    </span>
  )
}
