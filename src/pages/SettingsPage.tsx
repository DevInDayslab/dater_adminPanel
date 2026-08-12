import { useEffect, useState, type FormEvent } from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { AdminConfirmDialog } from "@/components/shared/AdminConfirmDialog"
import { SectionCard } from "@/components/shared/FieldGrid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useAdminAccount,
  useChangePassword,
  useRevokeSeoAdminSessions,
  useSaveSeoAdmin,
  useSeoAdminSessions,
  useSeoAdminSettings,
} from "@/hooks/useSettings"
import { formatDateTime } from "@/lib/formatters"
import { cn } from "@/lib/utils"
import { useAdminStore } from "@/stores/adminStore"

function FormMessage({
  message,
  variant,
}: {
  message: string | null
  variant: "error" | "success"
}) {
  if (!message) return null
  return (
    <p
      role="alert"
      className={cn(
        "text-sm",
        variant === "error" ? "text-[#FD1C1C]" : "text-emerald-700"
      )}
    >
      {message}
    </p>
  )
}

export function SettingsPage() {
  const pushToast = useAdminStore((s) => s.pushToast)

  const accountQuery = useAdminAccount()
  const seoAdminQuery = useSeoAdminSettings()
  const seoSessionsQuery = useSeoAdminSessions()
  const changePasswordMutation = useChangePassword()
  const saveSeoAdminMutation = useSaveSeoAdmin()
  const revokeSessionsMutation = useRevokeSeoAdminSessions()

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)

  const [seoEmail, setSeoEmail] = useState("")
  const [seoPassword, setSeoPassword] = useState("")
  const [seoError, setSeoError] = useState<string | null>(null)
  const [seoSuccess, setSeoSuccess] = useState<string | null>(null)
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false)

  const seoAdmin = seoAdminQuery.data
  const seoConfigured = seoAdmin?.configured === true

  useEffect(() => {
    if (seoConfigured) {
      setSeoEmail(seoAdmin.email)
    }
  }, [seoAdmin, seoConfigured])

  async function handlePasswordSubmit(event: FormEvent) {
    event.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(null)

    if (!currentPassword) {
      setPasswordError("Enter your current password.")
      return
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.")
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.")
      return
    }

    try {
      await changePasswordMutation.mutateAsync({ currentPassword, newPassword })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setPasswordSuccess("Password updated.")
      pushToast("Password updated")
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update password"
      setPasswordError(message)
      pushToast(message, "error")
    }
  }

  async function handleSeoAdminSubmit(event: FormEvent) {
    event.preventDefault()
    setSeoError(null)
    setSeoSuccess(null)

    if (!seoEmail.trim()) {
      setSeoError("SEO admin email is required.")
      return
    }
    if (!seoConfigured && seoPassword.length < 8) {
      setSeoError("Password is required and must be at least 8 characters.")
      return
    }
    if (seoPassword && seoPassword.length < 8) {
      setSeoError("New password must be at least 8 characters.")
      return
    }

    try {
      await saveSeoAdminMutation.mutateAsync({
        email: seoEmail.trim(),
        password: seoPassword || undefined,
      })
      setSeoPassword("")
      const message = seoConfigured ? "SEO admin updated." : "SEO admin created."
      setSeoSuccess(message)
      pushToast(message)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save SEO admin"
      setSeoError(message)
      pushToast(message, "error")
    }
  }

  async function handleRevokeSessions() {
    try {
      await revokeSessionsMutation.mutateAsync()
      setRevokeDialogOpen(false)
      setSeoSuccess("All SEO admin sessions revoked.")
      pushToast("All SEO admin sessions revoked")
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to revoke sessions"
      setSeoError(message)
      pushToast(message, "error")
    }
  }

  if (accountQuery.isLoading || seoAdminQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    )
  }

  if (accountQuery.isError) {
    return (
      <div className="admin-card p-8 text-center text-sm text-[#FD1C1C]">
        Failed to load account settings.{" "}
        {accountQuery.error instanceof Error
          ? accountQuery.error.message
          : "Try refreshing the page."}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your Dater Admin account and SEO admin credentials."
      />

      <SectionCard
        title="Reset password"
        description="Change the password for your Dater Admin account. Other active sessions will be signed out."
      >
        {accountQuery.data ? (
          <p className="mb-4 text-sm text-text-secondary">
            Signed in as <span className="font-medium text-black">{accountQuery.data.email}</span>
          </p>
        ) : null}

        <form className="w-[30rem] max-w-full space-y-5" onSubmit={handlePasswordSubmit}>
          <div className="w-full">
            <Label htmlFor="current-password">Current password</Label>
            <Input
              id="current-password"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value)
                setPasswordError(null)
                setPasswordSuccess(null)
              }}
              className="mt-1 h-10 w-full rounded-[14px]"
              aria-invalid={Boolean(passwordError)}
              required
            />
          </div>
          <div className="w-full">
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value)
                setPasswordError(null)
                setPasswordSuccess(null)
              }}
              className="mt-1 h-10 w-full rounded-[14px]"
              aria-invalid={Boolean(passwordError)}
              required
            />
          </div>
          <div className="w-full">
            <Label htmlFor="confirm-password">Confirm new password</Label>
            <Input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setPasswordError(null)
                setPasswordSuccess(null)
              }}
              className="mt-1 h-10 w-full rounded-[14px]"
              aria-invalid={Boolean(passwordError)}
              required
            />
          </div>
          <FormMessage message={passwordError} variant="error" />
          <FormMessage message={passwordSuccess} variant="success" />
          <Button type="submit" disabled={changePasswordMutation.isPending}>
            {changePasswordMutation.isPending ? "Updating…" : "Update password"}
          </Button>
        </form>
      </SectionCard>

      <SectionCard
        title="SEO admin credentials"
        description="Configure the account used to sign in to Dater SEO Admin. Changing the email or password signs out all active SEO sessions."
      >
        {seoAdminQuery.isError ? (
          <p className="mb-4 text-sm text-[#FD1C1C]">
            Failed to load SEO admin.{" "}
            {seoAdminQuery.error instanceof Error
              ? seoAdminQuery.error.message
              : "Try refreshing the page."}
          </p>
        ) : seoConfigured ? (
          <div className="mb-4 grid gap-2 text-sm text-text-secondary sm:grid-cols-2">
            <p>
              Last login:{" "}
              <span className="text-black">
                {seoAdmin.lastLoginAt ? formatDateTime(seoAdmin.lastLoginAt) : "Never"}
              </span>
            </p>
            <p>
              Active sessions:{" "}
              <span className="text-black">{seoAdmin.activeSessionCount}</span>
            </p>
          </div>
        ) : (
          <p className="mb-4 text-sm text-text-secondary">
            No SEO admin account is configured yet. Set an email and password below.
          </p>
        )}

        <form className="w-[30rem] max-w-full space-y-5" onSubmit={handleSeoAdminSubmit}>
          <div className="w-full">
            <Label htmlFor="seo-email">Email</Label>
            <Input
              id="seo-email"
              type="email"
              autoComplete="username"
              value={seoEmail}
              onChange={(e) => {
                setSeoEmail(e.target.value)
                setSeoError(null)
                setSeoSuccess(null)
              }}
              placeholder="seo@dater.app"
              className="mt-1 h-10 w-full rounded-[14px]"
              aria-invalid={Boolean(seoError)}
              required
            />
          </div>
          <div className="w-full">
            <Label htmlFor="seo-password">
              {seoConfigured ? "New password (optional)" : "Password"}
            </Label>
            <Input
              id="seo-password"
              type="password"
              autoComplete="new-password"
              value={seoPassword}
              onChange={(e) => {
                setSeoPassword(e.target.value)
                setSeoError(null)
                setSeoSuccess(null)
              }}
              className="mt-1 h-10 w-full rounded-[14px]"
              aria-invalid={Boolean(seoError)}
              required={!seoConfigured}
            />
          </div>
          <FormMessage message={seoError} variant="error" />
          <FormMessage message={seoSuccess} variant="success" />
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={saveSeoAdminMutation.isPending}>
              {saveSeoAdminMutation.isPending
                ? "Saving…"
                : seoConfigured
                  ? "Save changes"
                  : "Create SEO admin"}
            </Button>
            {seoConfigured ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setRevokeDialogOpen(true)}
                disabled={revokeSessionsMutation.isPending}
              >
                Revoke all SEO sessions
              </Button>
            ) : null}
          </div>
        </form>

        {seoConfigured && seoSessionsQuery.data?.sessions.length ? (
          <div className="mt-8 overflow-x-auto">
            <p className="mb-3 text-sm font-medium text-black">Active sessions</p>
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border-subtle text-text-muted">
                  <th className="py-2 pr-4 font-medium">Created</th>
                  <th className="py-2 pr-4 font-medium">Expires</th>
                  <th className="py-2 pr-4 font-medium">IP</th>
                  <th className="py-2 font-medium">User agent</th>
                </tr>
              </thead>
              <tbody>
                {seoSessionsQuery.data.sessions.map((session) => (
                  <tr key={session.id} className="border-b border-border-subtle/70">
                    <td className="py-2 pr-4">{formatDateTime(session.createdAt)}</td>
                    <td className="py-2 pr-4">{formatDateTime(session.expiresAt)}</td>
                    <td className="py-2 pr-4">{session.ipAddress || "—"}</td>
                    <td className="max-w-xs truncate py-2">{session.userAgent || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </SectionCard>

      <AdminConfirmDialog
        open={revokeDialogOpen}
        onOpenChange={setRevokeDialogOpen}
        title="Revoke all SEO sessions"
        description="This will sign out every device using the SEO admin account. They will need to sign in again."
        confirmationPhrase="REVOKE"
        confirmLabel="Revoke sessions"
        destructive
        isPending={revokeSessionsMutation.isPending}
        onConfirm={handleRevokeSessions}
      />
    </div>
  )
}
