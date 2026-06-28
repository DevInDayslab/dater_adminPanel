import { cn } from "@/lib/utils"

type DaterWordmarkProps = {
  className?: string
  size?: "sm" | "md"
}

export function DaterWordmark({ className, size = "md" }: DaterWordmarkProps) {
  const wordmarkSize = size === "sm" ? "text-2xl" : "text-[24px] leading-none"
  const tmSize = size === "sm" ? "text-[8px]" : "text-[8px]"

  return (
    <div className={cn("inline-flex items-start gap-0.5", className)}>
      <span className={cn("font-wordmark uppercase tracking-normal text-black", wordmarkSize)}>
        DATER
      </span>
      <span className={cn("mt-0.5 font-medium text-black", tmSize)}>TM</span>
    </div>
  )
}
