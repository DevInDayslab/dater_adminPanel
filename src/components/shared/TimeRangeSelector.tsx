import type { TimeWindow } from "@/types/enums"
import { TIME_WINDOW_OPTIONS } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function TimeRangeSelector({
  value,
  onChange,
  className,
}: {
  value: TimeWindow
  onChange: (value: TimeWindow) => void
  className?: string
}) {
  return (
    <div className={cn("inline-flex flex-wrap gap-1 rounded-md border border-border-subtle p-1", className)}>
      {TIME_WINDOW_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
            value === option.value
              ? "bg-black text-white"
              : "text-text-secondary hover:bg-surface-input hover:text-black"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
