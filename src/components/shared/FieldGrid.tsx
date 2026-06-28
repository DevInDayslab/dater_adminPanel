import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function TagChips({ items, emptyLabel = "—" }: { items: string[]; emptyLabel?: string }) {
  if (!items.length) {
    return <span className="text-sm text-text-muted">{emptyLabel}</span>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="inline-flex rounded-full border border-border-card px-3 py-1.5 text-[13px] text-black"
        >
          {item}
        </span>
      ))}
    </div>
  )
}

export function FieldGrid({
  fields,
  columns = 2,
}: {
  fields: { label: string; value: ReactNode }[]
  columns?: 1 | 2 | 3
}) {
  return (
    <div
      className={cn(
        "grid gap-4",
        columns === 1 && "grid-cols-1",
        columns === 2 && "grid-cols-1 md:grid-cols-2",
        columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      )}
    >
      {fields.map((field) => (
        <div key={field.label} className="min-w-0">
          <p className="text-xs font-medium tracking-[0.12px] text-text-muted uppercase">
            {field.label}
          </p>
          <div className="mt-1 text-sm leading-5 text-black">{field.value ?? "—"}</div>
        </div>
      ))}
    </div>
  )
}

export function SectionCard({
  title,
  description,
  children,
  className,
}: {
  title: string
  description?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn("admin-card overflow-hidden", className)}>
      <div className="border-b border-border-subtle px-4 py-4 md:px-5">
        <h5>{title}</h5>
      {description ? (
        <p className="mt-1 max-w-3xl text-pretty text-sm leading-6 text-text-secondary">{description}</p>
      ) : null}
      </div>
      <div className="p-4 md:p-5">{children}</div>
    </section>
  )
}
