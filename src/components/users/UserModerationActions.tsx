import { useEffect, useState } from "react"
import { AdminConfirmDialog } from "@/components/shared/AdminConfirmDialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUserModerationMutations } from "@/hooks/useUsers"
import { WARNING_REASONS } from "@/lib/constants"
import type { UserProfileDetail } from "@/types"
import { useAdminStore } from "@/stores/adminStore"

type DialogKind =
  | "warning"
  | "hide"
  | "unhide"
  | "ban"
  | "unban"
  | "delete"
  | null

type UserModerationActionsProps = {
  userId: string
  profile: Pick<UserProfileDetail, "name" | "accountState">
  size?: "sm" | "default"
  showIssueWarning?: boolean
}

function confirmationPhrase(name: string | null | undefined, userId: string) {
  return name?.trim() || userId.slice(0, 8)
}

export function UserModerationActions({
  userId,
  profile,
  size = "sm",
  showIssueWarning = true,
}: UserModerationActionsProps) {
  const [activeDialog, setActiveDialog] = useState<DialogKind>(null)
  const [warningReason, setWarningReason] = useState("")
  const mutations = useUserModerationMutations(userId)
  const pushToast = useAdminStore((s) => s.pushToast)

  const phrase = confirmationPhrase(profile.name, userId)
  const isDeleted = profile.accountState === "DELETED"
  const isHidden = profile.accountState === "HIDDEN_BY_MODERATION"
  const isBanned = profile.accountState === "BANNED"

  useEffect(() => {
    if (activeDialog !== "warning") setWarningReason("")
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

  const anyPending =
    mutations.issueWarning.isPending ||
    mutations.hideUser.isPending ||
    mutations.unhideUser.isPending ||
    mutations.banUser.isPending ||
    mutations.unbanUser.isPending ||
    mutations.deleteUser.isPending

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {showIssueWarning && !isDeleted ? (
          <Button
            variant="outline"
            size={size}
            disabled={anyPending}
            onClick={() => setActiveDialog("warning")}
          >
            Issue Warning
          </Button>
        ) : null}

        {!isDeleted && !isHidden ? (
          <Button
            variant="outline"
            size={size}
            disabled={anyPending}
            onClick={() => setActiveDialog("hide")}
          >
            Hide
          </Button>
        ) : null}

        {!isDeleted && isHidden ? (
          <Button
            variant="outline"
            size={size}
            disabled={anyPending}
            onClick={() => setActiveDialog("unhide")}
          >
            Unhide
          </Button>
        ) : null}

        {!isDeleted && !isBanned ? (
          <Button
            variant="outline"
            size={size}
            disabled={anyPending}
            onClick={() => setActiveDialog("ban")}
          >
            Ban
          </Button>
        ) : null}

        {!isDeleted && isBanned ? (
          <Button
            variant="outline"
            size={size}
            disabled={anyPending}
            onClick={() => setActiveDialog("unban")}
          >
            Unban
          </Button>
        ) : null}

        {!isDeleted ? (
          <Button
            variant="outline"
            size={size}
            disabled={anyPending}
            onClick={() => setActiveDialog("delete")}
          >
            Delete Account
          </Button>
        ) : null}
      </div>

      <Dialog open={activeDialog === "warning"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="w-[min(32rem,calc(100%-2rem))] max-w-none gap-5 rounded-[12px] p-6 sm:max-w-none">
          <DialogHeader className="pr-8">
            <DialogTitle>Issue warning</DialogTitle>
            <DialogDescription className="text-pretty">
              Increments this user&apos;s warning count. Three warnings can trigger an automatic ban.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label className="text-xs font-medium tracking-[0.12px] text-text-muted uppercase">
              Reason
            </Label>
            <Select value={warningReason} onValueChange={(value) => value && setWarningReason(value)}>
              <SelectTrigger className="h-10 w-full rounded-[14px]">
                <SelectValue>{warningReason || "Select a reason"}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {WARNING_REASONS.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="-mx-6 -mb-6 mt-2 border-t bg-transparent p-6 pt-4 sm:justify-end">
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button
              disabled={!warningReason || mutations.issueWarning.isPending}
              onClick={() =>
                runMutation(
                  () => mutations.issueWarning.mutateAsync(warningReason),
                  "Warning issued.",
                  "Failed to issue warning."
                )
              }
            >
              {mutations.issueWarning.isPending ? "Issuing…" : "Issue warning"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AdminConfirmDialog
        open={activeDialog === "hide"}
        onOpenChange={(open) => !open && closeDialog()}
        title="Hide user"
        description={`Shadowban ${profile.name ?? "this user"}. Their profile will be hidden from discovery but the account stays active.`}
        confirmationPhrase={phrase}
        confirmLabel="Hide user"
        isPending={mutations.hideUser.isPending}
        onConfirm={() =>
          runMutation(
            () => mutations.hideUser.mutateAsync("Hidden by admin"),
            "User hidden from discovery.",
            "Failed to hide user."
          )
        }
      />

      <AdminConfirmDialog
        open={activeDialog === "unhide"}
        onOpenChange={(open) => !open && closeDialog()}
        title="Unhide user"
        description={`Restore ${profile.name ?? "this user"} to active visibility.`}
        confirmationPhrase={phrase}
        confirmLabel="Unhide user"
        isPending={mutations.unhideUser.isPending}
        onConfirm={() =>
          runMutation(
            () => mutations.unhideUser.mutateAsync(),
            "User unhidden and restored to active.",
            "Failed to unhide user."
          )
        }
      />

      <AdminConfirmDialog
        open={activeDialog === "ban"}
        onOpenChange={(open) => !open && closeDialog()}
        title="Ban user"
        description={`Hard ban ${profile.name ?? "this user"}. They will not be able to use the app.`}
        confirmationPhrase={phrase}
        confirmLabel="Ban user"
        destructive
        isPending={mutations.banUser.isPending}
        onConfirm={() =>
          runMutation(
            () => mutations.banUser.mutateAsync("Banned by admin"),
            "User banned.",
            "Failed to ban user."
          )
        }
      />

      <AdminConfirmDialog
        open={activeDialog === "unban"}
        onOpenChange={(open) => !open && closeDialog()}
        title="Unban user"
        description={`Restore ${profile.name ?? "this user"} to active account state.`}
        confirmationPhrase={phrase}
        confirmLabel="Unban user"
        isPending={mutations.unbanUser.isPending}
        onConfirm={() =>
          runMutation(
            () => mutations.unbanUser.mutateAsync(),
            "User unbanned.",
            "Failed to unban user."
          )
        }
      />

      <AdminConfirmDialog
        open={activeDialog === "delete"}
        onOpenChange={(open) => !open && closeDialog()}
        title="Delete account"
        description={`Permanently soft-delete ${profile.name ?? "this user"}. This cannot be undone from the admin panel.`}
        confirmationPhrase={phrase}
        confirmLabel="Delete account"
        destructive
        isPending={mutations.deleteUser.isPending}
        onConfirm={() =>
          runMutation(
            () => mutations.deleteUser.mutateAsync(),
            "Account deleted.",
            "Failed to delete account."
          )
        }
      />
    </>
  )
}

export function UserModerationWarningChips({
  userId,
  profile,
}: {
  userId: string
  profile: Pick<UserProfileDetail, "name" | "accountState">
}) {
  const mutations = useUserModerationMutations(userId)
  const pushToast = useAdminStore((s) => s.pushToast)

  if (profile.accountState === "DELETED") return null

  return (
    <div className="flex flex-wrap gap-2">
      {WARNING_REASONS.map((reason) => (
        <Button
          key={reason}
          variant="outline"
          size="sm"
          disabled={mutations.issueWarning.isPending}
          onClick={async () => {
            try {
              const result = await mutations.issueWarning.mutateAsync(reason)
              pushToast(
                result.userBanned
                  ? `Warning issued. User auto-banned at ${result.moderationWarningCount} warnings.`
                  : `Warning issued (${result.moderationWarningCount} total).`
              )
            } catch (error) {
              pushToast(error instanceof Error ? error.message : "Failed to issue warning.")
            }
          }}
        >
          {reason}
        </Button>
      ))}
    </div>
  )
}
