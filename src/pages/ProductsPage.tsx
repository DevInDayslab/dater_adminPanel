import { useEffect, useMemo, useState } from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/shared/FieldGrid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useAdminProducts, useUpdateAdminProducts } from "@/hooks/useProducts"
import { useAdminStore } from "@/stores/adminStore"
import type { ProductConfiguration } from "@/types"

const PREMIUM_UNITS = ["Day", "Days", "Week", "Weeks", "Month", "Months"] as const

type DraftRow = {
  packCode: string
  category: ProductConfiguration["category"]
  displayTitle: string
  displayLabel: string
  quantity: string
  priceRupees: string
  compareAtPriceRupees: string
  badgeType: ProductConfiguration["badgeType"]
  badgeText: string
  isDefault: boolean
  isActive: boolean
  googlePlayProductId: string
  googlePlayBasePlanId: string
}

function toDraft(product: ProductConfiguration): DraftRow {
  return {
    packCode: product.packCode,
    category: product.category,
    displayTitle: product.displayTitle,
    displayLabel: product.displayLabel,
    quantity: String(product.quantity),
    priceRupees: String(product.pricePaise / 100),
    compareAtPriceRupees:
      product.compareAtPricePaise != null ? String(product.compareAtPricePaise / 100) : "",
    badgeType: product.badgeType,
    badgeText: product.badgeText ?? "",
    isDefault: product.isDefault,
    isActive: product.isActive,
    googlePlayProductId: product.googlePlayProductId ?? "",
    googlePlayBasePlanId: product.googlePlayBasePlanId ?? "",
  }
}

function PremiumSection({
  rows,
  onChange,
}: {
  rows: DraftRow[]
  onChange: (packCode: string, patch: Partial<DraftRow>) => void
}) {
  return (
    <SectionCard
      title="Premium"
      description="Set paywall copy and teaser prices. Google Play Console controls the actual checkout price. Map each plan to a Play subscription product and base plan ID."
    >
      <div className="admin-table-scroll">
        <table className="min-w-[1180px] w-full border-collapse">
          <thead>
            <tr className="bg-surface-input">
              {["Pack", "Amount", "Unit", "Teaser price (₹)", "Play product ID", "Play base plan", "Badge", "Default", "Active"].map((col) => (
                <th key={col} className="px-3 py-2 text-left text-xs text-text-muted">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.packCode} className="border-t border-border-subtle">
                <td className="px-3 py-2 text-sm font-medium">{row.packCode}</td>
                <td className="px-3 py-2">
                  <Input
                    value={row.displayTitle}
                    onChange={(event) =>
                      onChange(row.packCode, { displayTitle: event.target.value })
                    }
                    className="h-8 w-20"
                    inputMode="numeric"
                  />
                </td>
                <td className="px-3 py-2">
                  <Select
                    value={row.displayLabel}
                    onValueChange={(value) => {
                      if (value) onChange(row.packCode, { displayLabel: value })
                    }}
                  >
                    <SelectTrigger className="h-8 w-32">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {PREMIUM_UNITS.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-3 py-2">
                  <Input
                    value={row.priceRupees}
                    onChange={(event) => onChange(row.packCode, { priceRupees: event.target.value })}
                    className="h-8 w-28"
                    inputMode="numeric"
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    value={row.googlePlayProductId}
                    onChange={(event) =>
                      onChange(row.packCode, { googlePlayProductId: event.target.value })
                    }
                    placeholder="dater_premium"
                    className="h-8 w-40"
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    value={row.googlePlayBasePlanId}
                    onChange={(event) =>
                      onChange(row.packCode, { googlePlayBasePlanId: event.target.value })
                    }
                    placeholder="month"
                    className="h-8 w-32"
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    value={row.badgeText}
                    onChange={(event) => onChange(row.packCode, { badgeText: event.target.value })}
                    placeholder="Save 25%"
                    className="h-8 w-36"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="radio"
                    name="default-PREMIUM"
                    checked={row.isDefault}
                    onChange={() => onChange(row.packCode, { isDefault: true })}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={row.isActive}
                    onChange={(event) =>
                      onChange(row.packCode, { isActive: event.target.checked })
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  )
}

function PackSection({
  title,
  description,
  rows,
  onChange,
}: {
  title: string
  description: string
  rows: DraftRow[]
  onChange: (packCode: string, patch: Partial<DraftRow>) => void
}) {
  return (
    <SectionCard
      title={title}
      description={`${description} Teaser prices are for in-app display; Google Play controls checkout price.`}
    >
      <div className="admin-table-scroll">
        <table className="min-w-[1040px] w-full border-collapse">
          <thead>
            <tr className="bg-surface-input">
              {["Pack", "Quantity", "Teaser price (₹)", "Play product ID", "Badge", "Default", "Active"].map((col) => (
                <th key={col} className="px-3 py-2 text-left text-xs text-text-muted">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.packCode} className="border-t border-border-subtle">
                <td className="px-3 py-2 text-sm font-medium">{row.packCode}</td>
                <td className="px-3 py-2">
                  <Input
                    value={row.quantity}
                    onChange={(event) => onChange(row.packCode, { quantity: event.target.value })}
                    className="h-8 w-24"
                    inputMode="numeric"
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    value={row.priceRupees}
                    onChange={(event) => onChange(row.packCode, { priceRupees: event.target.value })}
                    className="h-8 w-28"
                    inputMode="numeric"
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    value={row.googlePlayProductId}
                    onChange={(event) =>
                      onChange(row.packCode, { googlePlayProductId: event.target.value })
                    }
                    placeholder="boost_6"
                    className="h-8 w-40"
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    value={row.badgeText}
                    onChange={(event) => onChange(row.packCode, { badgeText: event.target.value })}
                    placeholder="Save 25%"
                    className="h-8 w-36"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="radio"
                    name={`default-${row.category}`}
                    checked={row.isDefault}
                    onChange={() => onChange(row.packCode, { isDefault: true })}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={row.isActive}
                    onChange={(event) =>
                      onChange(row.packCode, { isActive: event.target.checked })
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  )
}

function ChatUnlockSection({
  rows,
  onChange,
}: {
  rows: DraftRow[]
  onChange: (packCode: string, patch: Partial<DraftRow>) => void
}) {
  return (
    <SectionCard
      title="Chat Unlock"
      description="Per-chat unlock teaser price. Google Play controls checkout price."
    >
      <div className="admin-table-scroll">
        <table className="min-w-[920px] w-full border-collapse">
          <thead>
            <tr className="bg-surface-input">
              {["Pack", "Label", "Teaser price (₹)", "Compare-at (₹)", "Play product ID", "Active"].map((col) => (
                <th key={col} className="px-3 py-2 text-left text-xs text-text-muted">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.packCode} className="border-t border-border-subtle">
                <td className="px-3 py-2 text-sm font-medium">{row.packCode}</td>
                <td className="px-3 py-2">
                  <Input
                    value={row.displayLabel}
                    onChange={(event) =>
                      onChange(row.packCode, { displayLabel: event.target.value })
                    }
                    className="h-8 w-32"
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    value={row.priceRupees}
                    onChange={(event) => onChange(row.packCode, { priceRupees: event.target.value })}
                    className="h-8 w-28"
                    inputMode="numeric"
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    value={row.compareAtPriceRupees}
                    onChange={(event) =>
                      onChange(row.packCode, { compareAtPriceRupees: event.target.value })
                    }
                    className="h-8 w-28"
                    inputMode="numeric"
                    placeholder="149"
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    value={row.googlePlayProductId}
                    onChange={(event) =>
                      onChange(row.packCode, { googlePlayProductId: event.target.value })
                    }
                    placeholder="chat_unlock_single"
                    className="h-8 w-44"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={row.isActive}
                    onChange={(event) =>
                      onChange(row.packCode, { isActive: event.target.checked })
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  )
}

export function ProductsPage() {
  const pushToast = useAdminStore((s) => s.pushToast)
  const productsQuery = useAdminProducts()
  const updateMutation = useUpdateAdminProducts()
  const [drafts, setDrafts] = useState<DraftRow[]>([])

  useEffect(() => {
    if (productsQuery.data?.products) {
      setDrafts(productsQuery.data.products.map(toDraft))
    }
  }, [productsQuery.data?.products])

  const grouped = useMemo(
    () => ({
      premium: drafts.filter((row) => row.category === "PREMIUM"),
      boost: drafts.filter((row) => row.category === "BOOST"),
      comments: drafts.filter((row) => row.category === "COMMENTS"),
      chat: drafts.filter((row) => row.category === "CHAT"),
    }),
    [drafts]
  )

  const handleChange = (packCode: string, patch: Partial<DraftRow>) => {
    setDrafts((current) =>
      current.map((row) => {
        if (row.packCode !== packCode && patch.isDefault) {
          const target = current.find((item) => item.packCode === packCode)
          if (target && row.category === target.category) {
            return { ...row, isDefault: false }
          }
        }
        if (row.packCode !== packCode) return row
        return { ...row, ...patch, isDefault: patch.isDefault ?? row.isDefault }
      })
    )
  }

  const handleSave = async () => {
    try {
      const playFields = (row: DraftRow) => ({
        googlePlayProductId: row.googlePlayProductId.trim() || null,
        googlePlayBasePlanId:
          row.category === "PREMIUM" ? row.googlePlayBasePlanId.trim() || null : undefined,
      })
      const payload = drafts.map((row) => {
        if (row.category === "PREMIUM") {
          return {
            packCode: row.packCode,
            priceRupees: Number(row.priceRupees),
            displayTitle: row.displayTitle.trim(),
            displayLabel: row.displayLabel.trim(),
            badgeText: row.badgeText.trim() || null,
            badgeType: row.badgeType,
            isDefault: row.isDefault,
            isActive: row.isActive,
            ...playFields(row),
          }
        }
        if (row.category === "CHAT") {
          return {
            packCode: row.packCode,
            priceRupees: Number(row.priceRupees),
            compareAtPriceRupees: row.compareAtPriceRupees.trim()
              ? Number(row.compareAtPriceRupees)
              : null,
            displayLabel: row.displayLabel.trim(),
            isActive: row.isActive,
            googlePlayProductId: row.googlePlayProductId.trim() || null,
          }
        }
        return {
          packCode: row.packCode,
          priceRupees: Number(row.priceRupees),
          quantity: Number(row.quantity),
          badgeText: row.badgeText.trim() || null,
          badgeType: row.badgeType,
          isDefault: row.isDefault,
          isActive: row.isActive,
          googlePlayProductId: row.googlePlayProductId.trim() || null,
        }
      })
      await updateMutation.mutateAsync(payload)
      pushToast("Product catalog saved")
    } catch (error) {
      pushToast(error instanceof Error ? error.message : "Failed to save products", "error")
    }
  }

  if (productsQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (productsQuery.isError) {
    return (
      <div className="admin-card p-8 text-center text-sm text-rose-600">
        Failed to load product catalog. Run migrations 035 and 036 on the backend database.
      </div>
    )
  }

  return (
    <div className="relative space-y-8 pb-24">
      <PageHeader
        title="Products"
        description="Edit paywall teaser prices, copy, and Google Play SKU mapping. Changes sync to the mobile app on next launch."
      />

      <PremiumSection rows={grouped.premium} onChange={handleChange} />
      <PackSection
        title="Boost"
        description="Boost pack offers across profile, home, messages, and peak-time overlays."
        rows={grouped.boost}
        onChange={handleChange}
      />
      <PackSection
        title="Comments"
        description="Comment pack offers across profile, stories, and write-comment flows."
        rows={grouped.comments}
        onChange={handleChange}
      />
      <ChatUnlockSection rows={grouped.chat} onChange={handleChange} />

      <div className="fixed bottom-6 right-6 z-40">
        <div className="rounded-full border border-border-subtle bg-white/95 p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-sm">
          <Button
            disabled={updateMutation.isPending}
            onClick={() => void handleSave()}
            className="min-w-36 rounded-full"
          >
            {updateMutation.isPending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}
