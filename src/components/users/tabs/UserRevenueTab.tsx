import { PremiumBadge } from "@/components/shared/PremiumBadge"
import { SectionCard } from "@/components/shared/FieldGrid"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useUserRevenue } from "@/hooks/useUsers"
import { FREE_TIER_DAILY_PROFILE_VIEWS } from "@/lib/constants"
import { formatCurrencyInr, formatDateTime } from "@/lib/formatters"
import { cn } from "@/lib/utils"
import type { BoostActivation, UserPurchase } from "@/types"

type UserRevenueTabProps = {
  userId: string
  enabled: boolean
}

function purchaseItemLabel(itemType: string) {
  switch (itemType) {
    case "SUBSCRIPTION":
    case "PREMIUM":
      return "Premium subscription"
    case "BOOST":
      return "Boost pack"
    case "UNLOCK_CHAT":
      return "Chat unlock"
    case "COMMENTS":
      return "Comment pack"
    default:
      return itemType.replace(/_/g, " ")
  }
}

function paymentStatusBadge(status: string) {
  const normalized = status.toUpperCase()
  if (normalized === "SUCCESS" || normalized === "COMPLETED" || normalized === "PAID") {
    return (
      <Badge variant="outline" className="rounded-full border-emerald-200 bg-emerald-50 text-emerald-800">
        Paid
      </Badge>
    )
  }
  if (normalized === "PENDING") {
    return (
      <Badge variant="outline" className="rounded-full border-amber-200 bg-amber-50 text-amber-800">
        Pending
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="rounded-full">
      {status}
    </Badge>
  )
}

function RevenueTabSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-28 w-full" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

function BoostActivationBadges({ activations }: { activations: BoostActivation[] }) {
  if (!activations.length) {
    return <p className="text-sm text-text-secondary">No boost activations yet.</p>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {activations.map((activation) => (
        <Badge
          key={activation.id}
          variant="outline"
          className={cn(
            "h-auto max-w-full items-start rounded-[10px] px-3 py-2 text-left whitespace-normal",
            activation.isActive
              ? "border-brand bg-brand/5 text-black"
              : "border-border-card text-text-secondary"
          )}
        >
          <span className="block text-xs font-medium">
            {activation.activatedCount} boost{activation.activatedCount === 1 ? "" : "s"}
            {activation.isActive ? " · Active" : " · Ended"}
          </span>
          <span className="mt-0.5 block text-[11px] font-normal opacity-80">
            {formatDateTime(activation.startedAt)} → {formatDateTime(activation.expiresAt)}
          </span>
        </Badge>
      ))}
    </div>
  )
}

function PurchaseLedgerTable({ purchases }: { purchases: UserPurchase[] }) {
  if (!purchases.length) {
    return <p className="text-sm text-text-secondary">No purchases recorded.</p>
  }

  return (
    <div className="admin-table-scroll">
      <Table>
        <TableHeader>
          <TableRow className="bg-surface-input hover:bg-surface-input">
            <TableHead className="text-xs text-text-muted">Date</TableHead>
            <TableHead className="text-xs text-text-muted">Item</TableHead>
            <TableHead className="text-xs text-text-muted">Pack</TableHead>
            <TableHead className="text-xs text-text-muted">Amount</TableHead>
            <TableHead className="text-xs text-text-muted">Qty</TableHead>
            <TableHead className="text-xs text-text-muted">Payment</TableHead>
            <TableHead className="text-xs text-text-muted">Transaction</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.map((purchase) => (
            <TableRow key={purchase.id}>
              <TableCell className="text-sm">{formatDateTime(purchase.createdAt)}</TableCell>
              <TableCell className="text-sm">{purchaseItemLabel(purchase.itemType)}</TableCell>
              <TableCell className="text-sm">{purchase.packCode ?? "—"}</TableCell>
              <TableCell className="text-sm">{formatCurrencyInr(purchase.amount)}</TableCell>
              <TableCell className="text-sm">{purchase.quantity ?? "—"}</TableCell>
              <TableCell>{paymentStatusBadge(purchase.paymentStatus ?? (purchase.transactionId ? "SUCCESS" : "PENDING"))}</TableCell>
              <TableCell className="max-w-[180px] truncate font-mono text-xs">
                {purchase.transactionId || "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function UserRevenueTab({ userId, enabled }: UserRevenueTabProps) {
  const revenueQuery = useUserRevenue(userId, enabled)

  if (revenueQuery.isLoading) {
    return <RevenueTabSkeleton />
  }

  if (revenueQuery.isError || !revenueQuery.data) {
    return <p className="text-sm text-[#FD1C1C]">Unable to load revenue data.</p>
  }

  const {
    premiumStatus,
    premiumPlanCode,
    premiumStartedAt,
    premiumExpiresAt,
    purchases,
    boostWallet,
    commentWallet,
    boostActivations,
    chatUnlocks,
    dailyProfileViewUsage,
  } = revenueQuery.data

  const totalSpend = purchases.reduce((sum, purchase) => sum + purchase.amount, 0)

  return (
    <div className="space-y-6">
      <SectionCard title="Wallets & subscription">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <PremiumBadge status={premiumStatus} />
            <span className="text-sm font-medium">{premiumPlanCode ?? "No plan"}</span>
          </div>
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs text-text-muted">Subscription started</p>
              <p className="mt-1">{formatDateTime(premiumStartedAt)}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Subscription expires</p>
              <p className="mt-1">{formatDateTime(premiumExpiresAt)}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[10px] border border-border-card p-4">
              <p className="text-xs text-text-muted">Boost credits</p>
              <p className="mt-1 text-2xl font-medium">{boostWallet.remainingCredits}</p>
              <p className="mt-1 text-sm text-text-secondary">Available to activate</p>
            </div>
            <div className="rounded-[10px] border border-border-card p-4">
              <p className="text-xs text-text-muted">Paid comments</p>
              <p className="mt-1 text-2xl font-medium">{commentWallet.remainingPaidComments}</p>
              <p className="mt-1 text-sm text-text-secondary">Remaining balance</p>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Purchase ledger">
        <p className="mb-4 text-sm text-text-secondary">
          Total spend:{" "}
          <span className="font-medium text-black">{formatCurrencyInr(totalSpend)}</span>
        </p>
        <PurchaseLedgerTable purchases={purchases} />
      </SectionCard>

      <SectionCard title="Consumables activity">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-medium">Boost activations</p>
            <BoostActivationBadges activations={boostActivations ?? []} />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Chat unlocks</p>
            {chatUnlocks.length ? (
              <div className="flex flex-wrap gap-2">
                {chatUnlocks.map((unlock) => (
                  <Badge
                    key={unlock.id}
                    variant="outline"
                    className="h-auto max-w-full rounded-[10px] px-3 py-2 text-left whitespace-normal"
                  >
                    <span className="block text-xs font-medium">{unlock.otherParticipantName}</span>
                    <span className="mt-0.5 block text-[11px] font-normal text-text-secondary">
                      Unlocked {formatDateTime(unlock.unlockedAt)}
                    </span>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-secondary">No chat unlocks yet.</p>
            )}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Daily profile views">
        <p className="text-sm">
          {dailyProfileViewUsage.profileViewCount} /{" "}
          {dailyProfileViewUsage.freeTierLimit ?? FREE_TIER_DAILY_PROFILE_VIEWS} views today
        </p>
      </SectionCard>
    </div>
  )
}
