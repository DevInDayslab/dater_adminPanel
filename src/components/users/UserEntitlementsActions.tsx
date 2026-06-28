import { useEffect, useState } from "react"
import { PremiumBadge } from "@/components/shared/PremiumBadge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUserEntitlementMutations } from "@/hooks/useUsers"
import { PREMIUM_GRANT_DURATIONS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { PremiumStatus } from "@/types/enums"
import { useAdminStore } from "@/stores/adminStore"

const premiumDialogClass =
  "w-[min(32rem,calc(100%-2rem))] max-w-none gap-5 rounded-[12px] border border-brand/20 p-6 sm:max-w-none"

type DialogKind = "premium" | "boosts" | "comments" | null

type UserEntitlementsActionsProps = {
  userId: string
  premiumStatus: PremiumStatus
  layout?: "section" | "inline"
}

function parsePositiveAmount(value: string) {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed < 1 || parsed > 9999) return null
  return parsed
}

export function UserEntitlementsActions({
  userId,
  premiumStatus,
  layout = "section",
}: UserEntitlementsActionsProps) {
  const [activeDialog, setActiveDialog] = useState<DialogKind>(null)
  const [selectedDays, setSelectedDays] = useState<number>(7)
  const [boostAmount, setBoostAmount] = useState("5")
  const [commentAmount, setCommentAmount] = useState("10")
  const mutations = useUserEntitlementMutations(userId)
  const pushToast = useAdminStore((s) => s.pushToast)

  const hasPremium = premiumStatus === "ACTIVE" || premiumStatus === "EXPIRED"

  useEffect(() => {
    if (activeDialog !== "premium") setSelectedDays(7)
    if (activeDialog !== "boosts") setBoostAmount("5")
    if (activeDialog !== "comments") setCommentAmount("10")
  }, [activeDialog])

  const closeDialog = () => setActiveDialog(null)

  const runMutation = async (
    action: () => Promise<unknown>,
    successMessage: string,
    errorMessage: string
  ) => {
    try {
      await action()
      closeDialog()
      pushToast(successMessage)
    } catch (error) {
      pushToast(error instanceof Error ? error.message : errorMessage)
    }
  }

  const actionButtons = (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        className="bg-brand text-white hover:bg-brand/90"
        onClick={() => setActiveDialog("premium")}
      >
        Grant premium
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-brand/30 text-brand hover:bg-brand/5"
        onClick={() => setActiveDialog("boosts")}
      >
        Grant boosts
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-brand/30 text-brand hover:bg-brand/5"
        onClick={() => setActiveDialog("comments")}
      >
        Grant comments
      </Button>
      {hasPremium ? (
        <Button
          variant="outline"
          size="sm"
          disabled={mutations.removePremium.isPending}
          onClick={() => {
            if (!window.confirm("Remove premium from this user?")) return
            void runMutation(
              () => mutations.removePremium.mutateAsync(),
              "Premium removed.",
              "Failed to remove premium."
            )
          }}
        >
          Remove premium
        </Button>
      ) : null}
    </div>
  )

  return (
    <>
      {layout === "section" ? (
        <div className="space-y-4 rounded-[10px] border border-brand/20 bg-brand/[0.03] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Premium & credits</p>
              <p className="mt-1 text-sm text-text-secondary">
                Grant or remove entitlements for support cases.
              </p>
            </div>
            <PremiumBadge status={premiumStatus} />
          </div>
          {actionButtons}
        </div>
      ) : (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium tracking-[0.12px] text-text-muted uppercase">
              Premium & credits
            </span>
            <PremiumBadge status={premiumStatus} />
          </div>
          {actionButtons}
        </div>
      )}

      <Dialog open={activeDialog === "premium"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className={premiumDialogClass}>
          <DialogHeader className="pr-8">
            <DialogTitle className="text-brand">Grant premium</DialogTitle>
            <DialogDescription className="text-pretty">
              Choose how long premium access should last for this user.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {PREMIUM_GRANT_DURATIONS.map((option) => (
              <button
                key={option.days}
                type="button"
                onClick={() => setSelectedDays(option.days)}
                className={cn(
                  "rounded-[10px] border px-3 py-2.5 text-sm font-medium transition-colors",
                  selectedDays === option.days
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-border-card hover:border-brand/30 hover:bg-brand/5"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <DialogFooter className="-mx-6 -mb-6 mt-2 border-t border-brand/10 bg-transparent p-6 pt-4 sm:justify-end">
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button
              className="bg-brand text-white hover:bg-brand/90"
              disabled={mutations.grantPremium.isPending}
              onClick={() =>
                runMutation(
                  () => mutations.grantPremium.mutateAsync(selectedDays),
                  `Premium granted for ${PREMIUM_GRANT_DURATIONS.find((o) => o.days === selectedDays)?.label ?? selectedDays + " days"}.`,
                  "Failed to grant premium."
                )
              }
            >
              {mutations.grantPremium.isPending ? "Granting…" : "Grant premium"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === "boosts"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className={premiumDialogClass}>
          <DialogHeader className="pr-8">
            <DialogTitle className="text-brand">Grant boosts</DialogTitle>
            <DialogDescription>
              Add boost credits to this user&apos;s wallet.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="boost-amount" className="text-xs font-medium tracking-[0.12px] text-text-muted uppercase">
              Number of boosts
            </Label>
            <Input
              id="boost-amount"
              type="number"
              min={1}
              max={9999}
              value={boostAmount}
              onChange={(event) => setBoostAmount(event.target.value)}
              className="h-10 rounded-[14px]"
            />
          </div>
          <DialogFooter className="-mx-6 -mb-6 mt-2 border-t border-brand/10 bg-transparent p-6 pt-4 sm:justify-end">
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button
              className="bg-brand text-white hover:bg-brand/90"
              disabled={mutations.grantBoosts.isPending || !parsePositiveAmount(boostAmount)}
              onClick={() => {
                const amount = parsePositiveAmount(boostAmount)
                if (!amount) return
                void runMutation(
                  () => mutations.grantBoosts.mutateAsync(amount),
                  `Added ${amount} boost credit${amount === 1 ? "" : "s"}.`,
                  "Failed to grant boosts."
                )
              }}
            >
              {mutations.grantBoosts.isPending ? "Granting…" : "Grant boosts"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === "comments"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className={premiumDialogClass}>
          <DialogHeader className="pr-8">
            <DialogTitle className="text-brand">Grant comments</DialogTitle>
            <DialogDescription>
              Add paid comment credits to this user&apos;s wallet.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="comment-amount" className="text-xs font-medium tracking-[0.12px] text-text-muted uppercase">
              Number of comments
            </Label>
            <Input
              id="comment-amount"
              type="number"
              min={1}
              max={9999}
              value={commentAmount}
              onChange={(event) => setCommentAmount(event.target.value)}
              className="h-10 rounded-[14px]"
            />
          </div>
          <DialogFooter className="-mx-6 -mb-6 mt-2 border-t border-brand/10 bg-transparent p-6 pt-4 sm:justify-end">
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button
              className="bg-brand text-white hover:bg-brand/90"
              disabled={mutations.grantComments.isPending || !parsePositiveAmount(commentAmount)}
              onClick={() => {
                const amount = parsePositiveAmount(commentAmount)
                if (!amount) return
                void runMutation(
                  () => mutations.grantComments.mutateAsync(amount),
                  `Added ${amount} comment credit${amount === 1 ? "" : "s"}.`,
                  "Failed to grant comments."
                )
              }}
            >
              {mutations.grantComments.isPending ? "Granting…" : "Grant comments"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
