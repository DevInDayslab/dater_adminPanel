import { useEffect } from "react"
import { useAdminStore } from "@/stores/adminStore"
import { cn } from "@/lib/utils"

export function AdminToasts() {
  const toasts = useAdminStore((s) => s.toasts)
  const dismissToast = useAdminStore((s) => s.dismissToast)

  useEffect(() => {
    if (!toasts.length) return
    const timers = toasts.map((toast) =>
      window.setTimeout(() => dismissToast(toast.id), 4200)
    )
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [toasts, dismissToast])

  if (!toasts.length) return null

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(100%-2rem,22rem)] flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "pointer-events-auto rounded-[14px] border px-4 py-3 text-sm shadow-sm",
            toast.variant === "error"
              ? "border-[#FD1C1C]/30 bg-white text-[#FD1C1C]"
              : "border-border-subtle bg-white text-black"
          )}
          role="status"
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}
