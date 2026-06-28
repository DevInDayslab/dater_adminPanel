import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type PageHeaderProps = {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-6 md:mb-8", className)}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="shrink-0">{title}</h1>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      {description ? (
        <p className="mt-2 max-w-3xl text-pretty text-sm leading-6 text-text-secondary">
          {description}
        </p>
      ) : null}
    </div>
  )
}
